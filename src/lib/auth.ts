import { SignJWT, jwtVerify } from "jose";

const DEFAULT_SECRET = "development-secret-change-me";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? DEFAULT_SECRET;
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in production");
  }
  return secret;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

export async function createToken(user: AuthUser) {
  const secret = new TextEncoder().encode(getJwtSecret());

  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(getJwtSecret());
  const { payload } = await jwtVerify(token, secret);

  return payload as AuthUser & { exp?: number; iat?: number };
}
