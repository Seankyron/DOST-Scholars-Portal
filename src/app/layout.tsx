import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'DOST-SEI Scholars Portal',
  description: 'Official portal for DOST-SEI CALABARZON scholars',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-auth-gradient">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}