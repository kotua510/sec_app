import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/userStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "email is required" }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  return NextResponse.json({
    success: true,
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          registrationAnswers: user.registrationAnswers,
          answerAnswers: user.answerAnswers,
        }
      : null,
  });
}
