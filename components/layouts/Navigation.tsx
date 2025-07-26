import Link from "next/link";

import MobileNavigation from "./MobileNavigation";
import { Home } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import ThemeSelector from "../shared/ThemeSelector";
import Logo from "../shared/Logo";

const Navigation = async () => {
  const user = await getCurrentUser();
  const navItems = [
    { href: "/dashboard/analytics", label: "Dashboard", icon: Home },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-transparent">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo />

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex gap-x-5">
          <ThemeSelector />
          <MobileNavigation user={user} />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
