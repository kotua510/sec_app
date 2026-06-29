export type DemoUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  password: string;
  registeredImage: string;
};

const createSvgDataUrl = (label: string, color: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <rect width="240" height="240" rx="24" fill="${color}" />
      <circle cx="120" cy="92" r="42" fill="white" opacity="0.95" />
      <rect x="56" y="148" width="128" height="52" rx="24" fill="white" opacity="0.9" />
      <text x="120" y="212" font-size="20" font-family="Arial, sans-serif" text-anchor="middle" fill="#1f2937">${label}</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const demoUsers: DemoUser[] = [
  {
    id: "demo-user-1",
    email: "user@example.com",
    name: "Demo User",
    role: "USER",
    password: "password",
    registeredImage: createSvgDataUrl("USER", "#2563eb"),
  },
  {
    id: "demo-admin-1",
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
    password: "admin123",
    registeredImage: createSvgDataUrl("ADMIN", "#7c3aed"),
  },
];

export const getDemoUser = (email: string) =>
  demoUsers.find((user) => user.email === email) ?? null;
