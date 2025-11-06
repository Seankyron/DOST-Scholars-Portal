'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { adminNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Import Close icon

// Props to control mobile state
interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full" // Mobile slide in/out
        )}
      >
        <div className="flex items-center justify-between h-20 bg-dost-blue px-4">
          <div className="flex items-center">
            <Image
                src="/dost-logo.png"
                alt="DOST-SEI Logo"
                width={48}
                height={48}
              />
            <h1 className="ml-3 text-xl font-bold text-white">Admin Portal</h1>
          </div>
          {/* Mobile Close Button */}
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* MODIFICATION: Changed 'scrollbar-thin' to 'scrollbar-none' */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-none">
          {adminNavigation.map((item) => (
            item.children ? (
              <div key={item.label} className="pt-4">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t pt-4">
                  {item.label}
                </h3>
                <div className="mt-2 space-y-1">
                  {item.children.map((child) => {
                    const Icon = child.icon;
                    const isActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium',
                          isActive
                            ? 'bg-dost-title text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                        onClick={onClose} // Close sidebar on mobile nav
                      >
                        <Icon className={cn(
                          'h-5 w-5',
                          !isActive && 'text-dost-title'
                        )} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium',
                  pathname === item.href
                    ? 'bg-dost-title text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={onClose} // Close sidebar on mobile nav
              >
                <item.icon className={cn(
                  'h-5 w-5',
                  pathname !== item.href && 'text-dost-title'
                )} />
                {item.label}
              </Link>
            )
          ))}
        </nav>
      </aside>
    </>
  );
}