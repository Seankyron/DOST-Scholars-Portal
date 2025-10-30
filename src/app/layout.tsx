import type { Metadata } from "next";
import "./globals.css"; // <-- THIS IS THE MISSING IMPORT

export const metadata: Metadata = {
  title: "DOST-SEI Scholars Portal",
  description: "Official portal for DOST-SEI CALABARZON scholars",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* The <body> tag is where your children (including the auth layout) will be rendered */}
      <body>
        {children}
      </body>
    </html>
  );
}