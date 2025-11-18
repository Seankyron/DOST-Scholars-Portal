// Updated AdminSidebar with non-collapsible Services and collapsible Practical Training
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { adminNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

/* ==================================================
   🧩 Sidebar Item (Recursive Only for Practical Training)
================================================== */
function SidebarItem({ item, pathname, onClose, level = 0 }: any) {
    const isActive = item.href === pathname;
    const Icon = item.icon;
    const indent = level * 16;

    // Only Practical Training should collapse
    const isCollapsible = item.label === 'Practical Training';

    const [open, setOpen] = useState(false);

    if (isCollapsible && item.children) {
        return (
            <div className={level === 0 ? 'pt-4' : ''}>
                {level === 0 && (
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t pt-4">
                        {item.label}
                    </h3>
                )}

                <button
                    onClick={() => setOpen(!open)}
                    style={{ marginLeft: indent }}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-left",
                        open ? "bg-gray-100" : "hover:bg-gray-100"
                    )}
                >
                    {Icon && <Icon className="h-5 w-5 text-dost-title" />}
                    <span>{item.label}</span>

                    <div className="ml-auto">
                        {open ? (
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                    </div>
                </button>

                {open && (
                    <div className="mt-1 space-y-1">
                        {item.children.map((child: any) => (
                            <SidebarItem
                                key={child.label}
                                item={child}
                                pathname={pathname}
                                onClose={onClose}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // NON-COLLAPSIBLE version for Services & others with children
    if (item.children && !isCollapsible) {
        return (
            <div className="pt-4">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t pt-4">
                    {item.label}
                </h3>
                <div className="mt-1 space-y-1">
                    {item.children.map((child: any) => (
                        <SidebarItem
                            key={child.label}
                            item={child}
                            pathname={pathname}
                            onClose={onClose}
                            level={level + 1}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Standard clickable link
    return (
        <Link
            href={item.href}
            onClick={onClose}
            style={{ marginLeft: indent }}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                isActive ? "bg-dost-title text-white" : "text-gray-700 hover:bg-gray-100"
            )}
        >
            {Icon && (
                <Icon className={cn("h-5 w-5", !isActive && "text-dost-title")} />
            )}
            {item.label}
        </Link>
    );
}

/* ==================================================
   📌 Main Sidebar Component
================================================== */
export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col h-screen transform transition-transform duration-300 ease-in-out md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex items-center justify-between h-20 bg-dost-title px-4">
                    <div className="flex items-center">
                        <Image src="/dost-logo.png" alt="DOST-SEI Logo" width={48} height={48} />
                        <h1 className="ml-3 text-xl font-bold text-white">Admin Portal</h1>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="md:hidden text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 overflow-y-hidden">
                    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-6 space-y-2">
                        {adminNavigation.map((item: any) => (
                            <SidebarItem
                                key={item.label}
                                item={item}
                                pathname={pathname}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
}