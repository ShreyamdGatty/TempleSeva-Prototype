import { http } from "../network";

export type RequestOtpResponse = {
  otpRef: string;
};

export async function requestOtp(
  mobileNumber: string,
  appHash: string,
): Promise<RequestOtpResponse> {
  return http.post<RequestOtpResponse>("/user/requestotp", {
    MobileNo: mobileNumber,
    AppHash: appHash,
  });
}

export type LoginResponse = {
  accessToken: string;
};

export async function loginWithOtp(
  mobileNo: string,
  otp: string,
  otpRef: string,
): Promise<LoginResponse> {
  return http.post<LoginResponse>(
    "/user/login",
    {
      MobileNo: mobileNo,
      otp,
      otpRef,
    },
    {
      skipAuthRefresh: true,
    },
  );
}
