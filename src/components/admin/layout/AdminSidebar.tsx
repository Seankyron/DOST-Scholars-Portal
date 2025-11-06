'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { adminNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white shadow-lg flex flex-col">
      <div className="flex items-center justify-center h-20 bg-dost-title">
        <Image
            src="/dost-logo.png"
            alt="DOST-SEI Logo"
            width={48}
            height={48}
          />
        <h1 className="ml-3 text-xl font-bold text-white">Admin Portal</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
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
  );
}