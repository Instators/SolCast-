import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolNeutral Launch Kit",
  description: "Turn your crypto idea into launch-ready content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
