import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/_components/Header";
import { SessionProvider } from "@/app/_contexts/SessionContext";

export const metadata: Metadata = {
  title: "NextBlogApp",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
          <Header />
          <div>{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;