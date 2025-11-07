import { ScholarHeader } from '@/components/scholar/layout/ScholarHeader';

export default function ScholarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className="flex min-h-full flex-col bg-auth-gradient">
      <ScholarHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}