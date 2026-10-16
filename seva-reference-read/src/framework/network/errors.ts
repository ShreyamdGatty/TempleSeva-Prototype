// A clean, predictable error shape for the whole app.
// Screens check `error.kind` (broad category) or `error.code` (specific backend code).

export type ErrorKind =
  | 'canceled'     // request aborted (React Query supersede / unmount)
  | 'network'      // no connection / server unreachable
  | 'timeout'      // request took too long
  | 'unauthorized' // 401 — token missing/expired
  | 'forbidden'    // 403 — logged in but not allowed
  | 'notFound'     // 404
  | 'conflict'     // 409 — conflicting state
  | 'validation'   // 400/422 — bad input / domain rule violation
  | 'server'       // 500-range
  | 'unknown';     // anything else

export class AppError extends Error {
  kind: ErrorKind;
  status?: number;   // HTTP status, if any
  data?: unknown;    // the server's error body (ProblemDetails), if any
  code?: string;     // the server's errorCode (e.g. "SEVA_NOT_FOUND"), if any

  constructor(
    kind: ErrorKind,
    message: string,
    status?: number,
    data?: unknown,
    code?: string,
  ) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.status = status;
    this.data = data;
    this.code = code;
  }
}