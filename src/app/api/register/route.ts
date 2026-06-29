import { NextResponse } from "next/server";
import { registerUser } from "@/lib/userStore";

export async function POST(request: Request) {
  try {
    const { name, email, password, registrationAnswers, answerAnswers } = await request.json();

    if (
      !name ||
      !email ||
      !password ||
      !Array.isArray(registrationAnswers) ||
      registrationAnswers.length === 0 ||
      !Array.isArray(answerAnswers) ||
      answerAnswers.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "名前・メール・パスワード・登録用質問・回答用質問をすべて入力してください" },
        { status: 400 }
      );
    }

    const user = await registerUser({
      name,
      email,
      password,
      registrationAnswers,
      answerAnswers,
      role: "USER",
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "登録に失敗しました";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
