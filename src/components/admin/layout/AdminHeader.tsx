'use client';

import { LogOut, UserCircle, Menu } from 'lucide-react'; // Import Menu icon
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

interface AdminHeaderProps {
  onMenuOpen: () => void; // Prop to open the sidebar
}

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    toast.loading('Logging out...');
    await signOut();
    toast.success('You have been logged out.');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-dost-blue border-b">
      {/* MODIFICATION: Changed justify-end to justify-between */}
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* MODIFICATION: Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/20"
          onClick={onMenuOpen}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* This div ensures the user icon stays on the right */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full p-2 h-10 w-10 hover:bg-white/20"
              >
                <UserCircle className="h-6 w-6 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user ? user.email : 'My Account'}
              </DropdownMenuLabel>
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
      </div>
    </header>
  );
}