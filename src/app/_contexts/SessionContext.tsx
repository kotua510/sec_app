"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";

type UserInfo = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

type SessionContextType = {
  isLoggedIn: boolean;
  user: UserInfo | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        const result = await response.json();
        if (response.ok && result.success && result.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchSession();
  }, []);

  const login = useCallback((_nextToken: string, nextUser: UserInfo) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(token),
      user,
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
