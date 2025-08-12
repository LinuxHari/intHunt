"use client";

import Link from "next/link";
import { LogOut, User, Home, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutModal from "@/components/shared/LogoutModal";
import UserAvatar from "../interview/UserAvatar";

interface MobileNavigationProps {
  user: User | null;
}

const MobileNavigation = ({ user }: MobileNavigationProps) => {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const navItems = [
    { href: "/dashboard/analytics", label: "Dashboard", icon: Home },
  ];

  return (
    <div className="flex items-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white dark:bg-gray-950">
          <div className="flex flex-col gap-4 mt-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full focus:ring-2 focus:ring-blue-500"
            >
              <UserAvatar user={user} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.name && (
                  <p className="font-medium text-sm text-black dark:text-white">
                    {user.name}
                  </p>
                )}
                {user?.email && (
                  <p className="w-48 truncate text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
              onClick={openLogoutModal}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/sign-in">
          <Button>Log In</Button>
        </Link>
      )}
      <LogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </div>
  );
};

export default MobileNavigation;
