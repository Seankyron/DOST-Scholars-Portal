import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // This imports your Tailwind styles

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DOST-SEI CALABARZON Scholars Portal",
  description: "Official portal for DOST-SEI CALABARZON scholars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* These <html> and <body> tags are required */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}