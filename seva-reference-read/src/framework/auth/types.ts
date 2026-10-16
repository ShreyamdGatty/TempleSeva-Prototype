// ---- existing ----
export type AuthMode = "required" | "optional" | "deferred";
export type AuthStatus = "loading" | "authenticated" | "guest";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
}
// ---- identity: identifier + credential are independent ----
export type Identifier = "phone" | "email";
export type Credential = "otp" | "password";

/** One allowed way to log in, e.g. phone+otp or email+password. */
export interface LoginMethod {
  identifier: Identifier;
  credential: Credential;
  label?: string; // optional UI override, e.g. "Sign in with OTP"
}

// ---- unlock: fast re-entry on a known device ----
export type UnlockMethod = "pin" | "biometric";

// ---- what bootstrap can route to ----
export type BootstrapTarget = "dashboard" | "login";
