'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toaster';

export function ScholarHeader() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    toast.loading('Logging out...');
    await signOut();
    toast.success('You have been logged out.');
    router.push('/login');
  };

  return (
    <header className=" top-0 z-40 w-full bg-transparent">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/scholar/dashboard" className="flex items-center gap-2">
          <Image
            src="/dost-logo.png"
            alt="DOST-SEI Logo"
            width={48}
            height={48}
          />
          <span className="hidden text-2xl font-bold text-white sm:block">
            DOST-SEI CALABARZON Scholars Portal
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full p-2 h-10 w-10 hover:bg-white/20"
            >
              <Settings className="h-6 w-6 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user ? user.email : 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/scholar/profile">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}