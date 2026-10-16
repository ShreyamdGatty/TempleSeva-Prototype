import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { appConfig } from "../config";
import { AppError, ErrorKind } from "./errors";

type TokenGetter = () => string | null;
type TokenRefresher = () => Promise<string | null>;
type AuthFailureHandler = () => void;

// Tenant headers the client attaches to tenant-specific requests.
type TenantHeaders = {
  tenantid?: string;
  sdid?: string;
  digiorgid?: string;
} | null;
type TenantGetter = () => TenantHeaders;

type ProblemDetails = {
  title?: string;
  status?: number;
  detail?: string;
  type?: string;
  errorCode?: string;
  message?: string;
};

// Extra config flag: set skipTenant:true to NOT attach tenant headers.
export type AppRequestConfig = AxiosRequestConfig & {
  skipTenant?: boolean;
  skipAuthRefresh?: boolean;
};

export class HttpClient {
  private instance: AxiosInstance;
  private getToken: TokenGetter = () => null;
  private getTenant: TenantGetter = () => null;
  private refreshToken: TokenRefresher = async () => null;
  private onAuthFailure: AuthFailureHandler = () => {};

  private isRefreshing = false;
  private waiters: ((token: string | null) => void)[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: appConfig.api.baseURL,
      timeout: appConfig.api.timeout,
      headers: { "Content-Type": "application/json" },
    });
    this.attachAuthInterceptor();
    this.attachRefreshInterceptor();
  }

  setTokenGetter(getter: TokenGetter): void {
    this.getToken = getter;
  }

  // Auth/temple plugs in how to read the current tenant headers.
  setTenantGetter(getter: TenantGetter): void {
    this.getTenant = getter;
  }

  setRefreshHandlers(
    refresher: TokenRefresher,
    onFailure: AuthFailureHandler,
  ): void {
    this.refreshToken = refresher;
    this.onAuthFailure = onFailure;
  }

  private attachAuthInterceptor(): void {
    this.instance.interceptors.request.use((config) => {
      // Auth token
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Tenant headers — unless this request opted out.
      const skipTenant = (config as AppRequestConfig).skipTenant === true;
      if (!skipTenant) {
        const tenant = this.getTenant();
        if (tenant) {
          if (tenant.tenantid) config.headers["tenantid"] = tenant.tenantid;
          if (tenant.sdid) config.headers["sdid"] = tenant.sdid;
          if (tenant.digiorgid) config.headers["digiorgid"] = tenant.digiorgid;
        }
      }

      return config;
    });
  }

  private attachRefreshInterceptor(): void {
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as
          | (AppRequestConfig & { _retried?: boolean })
          | undefined;

        const is401 = error.response?.status === 401;

        if (
          !is401 ||
          !original ||
          original._retried ||
          original.skipAuthRefresh
        ) {
          return Promise.reject(error);
        }

        original._retried = true;

        if (this.isRefreshing) {
          const newToken = await new Promise<string | null>((resolve) => {
            this.waiters.push(resolve);
          });
          if (!newToken) return Promise.reject(error);
          return this.retryWithToken(original, newToken);
        }

        this.isRefreshing = true;
        try {
          const newToken = await this.refreshToken();
          this.waiters.forEach((resolve) => resolve(newToken));
          this.waiters = [];

          if (!newToken) {
            this.onAuthFailure();
            return Promise.reject(error);
          }

          return this.retryWithToken(original, newToken);
        } catch (refreshErr) {
          this.waiters.forEach((resolve) => resolve(null));
          this.waiters = [];
          this.onAuthFailure();
          return Promise.reject(error);
        } finally {
          this.isRefreshing = false;
        }
      },
    );
  }

  private retryWithToken(config: AxiosRequestConfig, token: string) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    return this.instance.request(config);
  }

  async get<T>(url: string, config?: AppRequestConfig): Promise<T> {
    return this.request<T>(() => this.instance.get<T>(url, config));
  }
  async post<T>(
    url: string,
    body?: unknown,
    config?: AppRequestConfig,
  ): Promise<T> {
    return this.request<T>(() => this.instance.post<T>(url, body, config));
  }
  async put<T>(
    url: string,
    body?: unknown,
    config?: AppRequestConfig,
  ): Promise<T> {
    return this.request<T>(() => this.instance.put<T>(url, body, config));
  }
  async patch<T>(
    url: string,
    body?: unknown,
    config?: AppRequestConfig,
  ): Promise<T> {
    return this.request<T>(() => this.instance.patch<T>(url, body, config));
  }
  async delete<T>(url: string, config?: AppRequestConfig): Promise<T> {
    return this.request<T>(() => this.instance.delete<T>(url, config));
  }

  private async request<T>(fn: () => Promise<{ data: T }>): Promise<T> {
    try {
      const response = await fn();
      return response.data;
    } catch (err) {
      throw this.toAppError(err);
    }
  }

  private toAppError(err: unknown): AppError {
    if (axios.isCancel(err)) {
      return new AppError("canceled", "Request was canceled");
    }
    if (!axios.isAxiosError(err)) {
      return new AppError("unknown", "Something went wrong");
    }
    if (err.code === "ECONNABORTED") {
      return new AppError(
        "timeout",
        "The request timed out. Please try again.",
      );
    }
    if (!err.response) {
      return new AppError(
        "network",
        "No internet connection. Please check your network.",
      );
    }

    const status = err.response.status;
    const data = err.response.data as ProblemDetails | undefined;
    const kind = this.kindFromStatus(status);
    const message = this.messageFor(kind, data);
    const code = data?.errorCode;

    return new AppError(kind, message, status, data, code);
  }

  private kindFromStatus(status: number): ErrorKind {
    if (status === 401) return "unauthorized";
    if (status === 403) return "forbidden";
    if (status === 404) return "notFound";
    if (status === 409) return "conflict";
    if (status === 400 || status === 422) return "validation";
    if (status >= 500) return "server";
    return "unknown";
  }

  private messageFor(
    kind: ErrorKind,
    data: ProblemDetails | undefined,
  ): string {
    const serverMsg = data?.detail ?? data?.message ?? data?.title;
    if (serverMsg) return String(serverMsg);
    switch (kind) {
      case "unauthorized":
        return "Your session has expired. Please sign in again.";
      case "forbidden":
        return "You don't have permission to do that.";
      case "notFound":
        return "The requested item was not found.";
      case "conflict":
        return "This action conflicts with the current state.";
      case "validation":
        return "Please check your input and try again.";
      case "server":
        return "Something went wrong on our end. Please try later.";
      default:
        return "Something went wrong.";
    }
  }
}

export const http = new HttpClient();
