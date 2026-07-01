"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { secretQuestions } from "@/lib/secretQuestions";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [secretAnswers, setSecretAnswers] = useState<string[]>(() => Array(secretQuestions.length).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        registrationAnswers: secretQuestions.map((question, index) => ({
          question,
          answer: secretAnswers[index] ?? "",
        })),
        answerAnswers: secretQuestions.map((question, index) => ({
          question,
          answer: secretAnswers[index] ?? "",
        })),
      }),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok || !result.success) {
      setError(result.message ?? "登録に失敗しました");
      return;
    }

    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">ユーザー登録</h1>

        <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              名前
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
              placeholder="山田 太郎"
              required
            />
          </div>

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
              required
            />
          </div>

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
                autoComplete="new-password"
                required
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

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">秘密の質問に全て回答してください</label>
              {secretQuestions.map((question, index) => (
                <div key={question}>
                  <label htmlFor={`secret-question-${index}`} className="block text-sm text-gray-600">
                    {question}
                  </label>
                  <input
                    id={`secret-question-${index}`}
                    value={secretAnswers[index] ?? ""}
                    onChange={(event) => {
                      const next = [...secretAnswers];
                      next[index] = event.target.value;
                      setSecretAnswers(next);
                    }}
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2"
                    placeholder="回答"
                    autoComplete="off"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </button>
        </form>
      </div>
    </main>
  );
}
