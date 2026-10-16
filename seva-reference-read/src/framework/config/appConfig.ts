import { AuthMode, LoginMethod, UnlockMethod } from "../auth/types";

export interface AuthConfig {
  methods: LoginMethod[];

  primaryMethod?: number;

  otpLength: 4 | 6;

  unlockMethods: UnlockMethod[];

  requireUnlockOnLaunch: boolean;
}

export interface AppConfig {
  authMode: AuthMode;
  auth: AuthConfig;
  api: ApiConfig;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number; // milliseconds
}

export const appConfig: AppConfig = {
  authMode: "required", // 'required' | 'optional' | 'deferred'

  auth: {
    methods: [
      {
        identifier: "phone",
        credential: "otp",
        label: "Mobile number",
      },
    ],

    primaryMethod: 0,

    otpLength: 6,

    unlockMethods: [],

    requireUnlockOnLaunch: false,
  },

  api: {
    // For now, a free public test API to prove it works.
    // Later: swap for your ASP.NET Core URL, e.g. 'https://10.0.2.2:5001/api'
    baseURL: "https://api.templeseva.app/api",
    timeout: 120000,
  },
};
