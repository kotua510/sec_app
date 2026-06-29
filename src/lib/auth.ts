import { SignJWT, jwtVerify } from "jose";

const DEFAULT_SECRET = "development-secret-change-me";
export const JWT_SECRET = process.env.JWT_SECRET ?? DEFAULT_SECRET;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

export async function createToken(user: AuthUser) {
  const secret = new TextEncoder().encode(JWT_SECRET);

  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  return payload as AuthUser & { exp?: number; iat?: number };
}
