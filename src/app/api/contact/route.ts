import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  ApiError,
  ApiErrorCode,
  HttpStatus,
  ValidationError,
} from "@/types/api/errors";
import { CreateContactMessageRequest } from "@/types/api/requests";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateContactMessageRequest;

    const firstName = body.firstName?.trim();
    const phone = body.phone?.trim();
    const message = body.message?.trim();

    if (!firstName || !phone || !message) {
      throw new ValidationError("Validation failed", [
        {
          field: "firstName",
          message: "First name, phone and message are required",
        },
      ]);
    }

    await prisma.contactMessage.create({
      data: {
        firstName,
        lastName: body.lastName?.trim() || null,
        subject: body.subject?.trim() || null,
        phone,
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact message stored successfully",
        timestamp: new Date().toISOString(),
      },
      { status: HttpStatus.CREATED },
    );
  } catch (error) {
    console.error("Error storing contact message:", error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
          timestamp: new Date().toISOString(),
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.INTERNAL_SERVER_ERROR,
          message: "Internal server error",
        },
        timestamp: new Date().toISOString(),
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
