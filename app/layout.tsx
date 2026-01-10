import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "麻雀点数計算トレーニング",
  description: "実戦に近い形で点数計算を練習できるトレーニングアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
