import { apiClient } from "./client";
import { ApiResponse } from "@/types/api/responses";
import { CreateContactMessageRequest } from "@/types/api/requests";

export async function sendMessage(
  payload: CreateContactMessageRequest,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<ApiResponse<{ message: string }>>(
    "/api/contact",
    payload,
  );
}
