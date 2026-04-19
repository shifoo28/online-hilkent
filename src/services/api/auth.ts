/**
 * Auth Service
 * All authentication-related API calls with full type safety
 */

import { apiClient } from "./client";
import {
  SignInRequest,
  SignUpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  AuthResponse,
  ApiResponse,
} from "@/types/api";

/**
 * Sign in with email and password
 */
export async function signIn(
  payload: SignInRequest,
): Promise<ApiResponse<AuthResponse>> {
  return apiClient.post<ApiResponse<AuthResponse>>("/api/auth/signin", payload);
}

/**
 * Sign up with email and password
 */
export async function signUp(
  payload: SignUpRequest,
): Promise<ApiResponse<AuthResponse>> {
  return apiClient.post<ApiResponse<AuthResponse>>("/api/auth/signup", payload);
}

/**
 * Send OTP to email
 */
export async function sendOtp(
  payload: SendOtpRequest,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<ApiResponse<{ message: string }>>(
    "/api/auth/send-otp",
    payload,
  );
}

/**
 * Verify OTP
 */
export async function verifyOtp(
  payload: VerifyOtpRequest,
): Promise<ApiResponse<AuthResponse>> {
  return apiClient.post<ApiResponse<AuthResponse>>(
    "/api/auth/verify-otp",
    payload,
  );
}

/**
 * Sign out
 */
export async function signOut(): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<ApiResponse<{ message: string }>>("/api/auth/signout");
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<ApiResponse<AuthResponse>> {
  return apiClient.post<ApiResponse<AuthResponse>>("/api/auth/refresh");
}
