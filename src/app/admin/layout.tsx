'use client'; // <-- Needs to be a Client Component

import { useState } from 'react'; // Import useState
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Pass state and handlers to sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex flex-1 flex-col">
        {/* Pass handler to header */}
        <AdminHeader onMenuOpen={() => setIsSidebarOpen(true)} />
        {/* Adjusted padding for mobile */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}