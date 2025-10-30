// src/app/layout.tsx
import './globals.css'; // Make sure this is pointing to your global styles

export const metadata = {
  title: 'DOST-SEI Scholars Portal',
  description: 'Scholars Portal for DOST-SEI CALABARZON',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}