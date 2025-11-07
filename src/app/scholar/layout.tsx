import { ScholarHeader } from '@/components/scholar/layout/ScholarHeader';

export default function ScholarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // MODIFICATION: Added 'bg-auth-gradient' here.
    <div className="flex min-h-screen flex-col bg-auth-gradient">
      <ScholarHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}