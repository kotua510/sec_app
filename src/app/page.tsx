"use client";

import { useSession } from "@/app/_contexts/SessionContext";

export default function Home() {
  const { isLoggedIn, user } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">NextBlogApp へようこそ</h1>

        <div className="rounded-lg bg-white p-8 shadow">
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">認証状態</h2>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isLoggedIn ? "bg-green-500" : "bg-red-500"}`} />
              <p className="text-lg text-gray-700">
                {isLoggedIn ? (
                  <span className="font-semibold text-green-600">JWTトークンでログイン済みです</span>
                ) : (
                  <span className="font-semibold text-red-600">未ログインです</span>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              {isLoggedIn && user ? (
                <>
                  <span className="block">ユーザー名: {user.name}</span>
                  <span className="block">メールアドレス: {user.email}</span>
                  <span className="block">権限: {user.role}</span>
                </>
              ) : (
                "ログインすると、JWTトークンがLocalStorageに保存され、ヘッダー上部にユーザー情報が表示されます。"
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}