import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { findUserByEmail, verifyPassword, verifySecretAnswers } from "@/lib/userStore";

export async function POST(request: Request) {
  const { email, password, answerAnswers, secretAnswers } = await request.json();

  const user = await findUserByEmail(email);
  if (!user) {
return NextResponse.json({ success: false, message: "メールアドレスまたはパスワードが違います" });
  }

  const hasPasswordAttempt = typeof password === "string" && password.length > 0;
  const secretEntries = Array.isArray(answerAnswers) ? answerAnswers : Array.isArray(secretAnswers) ? secretAnswers : [];
  const hasSecretAnswersAttempt = secretEntries.length > 0;

  if (hasPasswordAttempt) {
    const isPasswordValid = await verifyPassword(user, password);
    if (isPasswordValid) {
      const token = await createToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 12,
      });

      return response;
    }
  }

  if (hasSecretAnswersAttempt) {
    const isSecretAnswersValid = await verifySecretAnswers(user, secretEntries);
    if (isSecretAnswersValid) {
      const token = await createToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 12,
      });

      return response;
    }
  }

  return NextResponse.json({ success: false, message: "認証情報が正しくありません" });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "email is required" }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  return NextResponse.json({
    success: true,
    user: user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null,
  });
}
