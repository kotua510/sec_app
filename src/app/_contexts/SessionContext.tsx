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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("jwt_token");
    const savedUser = window.localStorage.getItem("jwt_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = useCallback((nextToken: string, nextUser: UserInfo) => {
    window.localStorage.setItem("jwt_token", nextToken);
    window.localStorage.setItem("jwt_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("jwt_token");
    window.localStorage.removeItem("jwt_user");
    setToken(null);
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
