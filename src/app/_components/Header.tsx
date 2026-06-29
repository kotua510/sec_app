"use client";

import Link from "next/link";
import { useSession } from "@/app/_contexts/SessionContext";

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useSession();

  return (
    <header>
      <div className="flex items-center justify-between bg-slate-800 px-6 py-4 text-white">
        <h1 className="text-xl font-bold">
          <Link href="/">NextBlogApp</Link>
        </h1>
        <nav className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <span className="text-sm">{user.name} / {user.role}</span>
              <button
                onClick={logout}
                className="rounded bg-red-600 px-4 py-1 text-sm hover:bg-red-700"
              >
                ログアウト
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/register"
                className="rounded bg-green-600 px-4 py-1 text-sm hover:bg-green-700"
              >
                新規登録
              </Link>
              <Link
                href="/login"
                className="rounded bg-blue-600 px-4 py-1 text-sm hover:bg-blue-700"
              >
                ログイン
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;