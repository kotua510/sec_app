import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { demoUsers } from "@/lib/demoUsers";

export type StoredSecretAnswer = {
  question: string;
  answerHash: string;
};

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  passwordHash: string;
  registeredImage: string;
  registrationAnswers: StoredSecretAnswer[];
  answerAnswers: StoredSecretAnswer[];
  createdAt: string;
};

const USERS_FILE_PATH = path.join(process.cwd(), "data", "users.json");

async function ensureUsersFile() {
  await mkdir(path.dirname(USERS_FILE_PATH), { recursive: true });

  try {
    const content = await readFile(USERS_FILE_PATH, "utf8");
    const users = JSON.parse(content) as Array<Partial<StoredUser> & { secretQuestion?: string; secretAnswerHash?: string; secretAnswers?: StoredSecretAnswer[]; registrationAnswers?: StoredSecretAnswer[]; answerAnswers?: StoredSecretAnswer[] }>;

    return Promise.all(
      users.map(async (user) => {
        const legacyRegistrationAnswers = Array.isArray(user.registrationAnswers)
          ? user.registrationAnswers
          : Array.isArray(user.secretAnswers)
            ? user.secretAnswers
            : [];
        const legacyAnswerAnswers = Array.isArray(user.answerAnswers) ? user.answerAnswers : [];

        return {
          id: user.id ?? `user-${Date.now()}`,
          email: user.email ?? "",
          name: user.name ?? "",
          role: user.role ?? "USER",
          passwordHash: user.passwordHash ?? "",
          registeredImage: user.registeredImage ?? "",
          registrationAnswers: legacyRegistrationAnswers,
          answerAnswers: legacyAnswerAnswers,
          createdAt: user.createdAt ?? new Date().toISOString(),
        };
      })
    );
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      throw error;
    }

    const seedUsers = await Promise.all(
      demoUsers.map(async (user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash: await bcrypt.hash(user.password, 10),
        registeredImage: user.registeredImage,
        registrationAnswers: [],
        answerAnswers: [],
        createdAt: new Date().toISOString(),
      }))
    );

    await writeFile(USERS_FILE_PATH, JSON.stringify(seedUsers, null, 2), "utf8");
    return seedUsers;
  }
}

export async function getAllUsers() {
  return ensureUsersFile();
}

export async function findUserByEmail(email: string) {
  const users = await getAllUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  registrationAnswers: Array<{ question: string; answer: string }>;
  answerAnswers: Array<{ question: string; answer: string }>;
  role?: "USER" | "ADMIN";
}) {
  const users = await getAllUsers();

  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("このメールアドレスは既に登録されています");
  }

  const hasSamePassword = await Promise.all(
    users.map((user) => bcrypt.compare(input.password, user.passwordHash))
  );

  if (hasSamePassword.some(Boolean)) {
    throw new Error("このパスワードは既に使用されています");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const registrationAnswers = await Promise.all(
    input.registrationAnswers.map(async (entry) => ({
      question: entry.question,
      answerHash: await bcrypt.hash(entry.answer, 10),
    }))
  );
  const answerAnswers = await Promise.all(
    input.answerAnswers.map(async (entry) => ({
      question: entry.question,
      answerHash: await bcrypt.hash(entry.answer, 10),
    }))
  );
  const user: StoredUser = {
    id: `user-${Date.now()}`,
    email: input.email,
    name: input.name,
    role: input.role ?? "USER",
    passwordHash,
    registeredImage: "",
    registrationAnswers,
    answerAnswers,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf8");

  return user;
}

export async function verifyPassword(user: StoredUser, password: string) {
  return bcrypt.compare(password, user.passwordHash);
}

export async function verifySecretAnswers(user: StoredUser, answers: Array<{ question: string; answer: string }>) {
  if (user.answerAnswers.length !== answers.length) {
    return false;
  }

  for (const entry of answers) {
    const storedEntry = user.answerAnswers.find((item) => item.question === entry.question);
    if (!storedEntry) {
      return false;
    }

    const isValid = await bcrypt.compare(entry.answer, storedEntry.answerHash);
    if (!isValid) {
      return false;
    }
  }

  return true;
}
