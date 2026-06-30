"use client";

import { useSession } from "@/app/_contexts/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { secretQuestions } from "@/lib/secretQuestions";

export default function LoginPage() {
  const { isLoggedIn, login } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [secretAnswers, setSecretAnswers] = useState<string[]>(() => Array(secretQuestions.length).fill(""));
  const [loginMode, setLoginMode] = useState<"password" | "secret">("password");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: loginMode === "password" ? password : "",
        answerAnswers: loginMode === "secret"
          ? secretQuestions.map((question, index) => ({
              question,
              answer: secretAnswers[index] ?? "",
            }))
          : [],
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      setError(result.message ?? "ログインに失敗しました");
      return;
    }

    login(result.token, result.user);
    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">ログイン</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                placeholder="example@example.com"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLoginMode("password")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${loginMode === "password" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700"}`}
              >
                パスワードでログイン
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("secret")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${loginMode === "secret" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700"}`}
              >
                秘密の質問でログイン
              </button>
            </div>

            {loginMode === "password" ? (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 pr-24"
                    placeholder="パスワード"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 mr-2 flex items-center rounded-md px-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? "非表示" : "表示"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">秘密の質問に全て回答してください</label>
                {secretQuestions.map((question, index) => (
                  <div key={question}>
                    <label htmlFor={`login-secret-answer-${index}`} className="block text-sm text-gray-600">
                      {question}
                    </label>
                    <input
                      id={`login-secret-answer-${index}`}
                      value={secretAnswers[index] ?? ""}
                      onChange={(event) => {
                        const next = [...secretAnswers];
                        next[index] = event.target.value;
                        setSecretAnswers(next);
                      }}
                      className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                      placeholder="回答"
                    />
                  </div>
                ))}
              </div>
            )}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
            >
              ログイン
            </button>
          </form>

          <p className="mt-2 text-center text-sm text-blue-600">
            <Link href="/register">新規登録はこちら</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
