'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (

    <div className="h-full overflow-hidden bg-gray-50">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-col md:ml-64 h-full">
        <AdminHeader onMenuOpen={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}