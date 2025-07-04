"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Package,
  Settings,
  LogOut,
  Menu,
  Bell,
  Bike,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import logo from "@/public/logo.png";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export function DeliveryLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const [notificationCount] = useState(3);

  const navItems = [
    { title: "Dashboard", href: "/delivery/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { title: "My Deliveries", href: "/delivery/my_deliveries", icon: <Package className="h-5 w-5" /> },
    { title: "Delivery Map", href: "/delivery/map", icon: <MapPin className="h-5 w-5" /> },
    { title: "Earnings", href: "/delivery/earnings", icon: <Clock className="h-5 w-5" /> },
    { title: "Profile", href: "/delivery/profile", icon: <User className="h-5 w-5" /> },
    { title: "Settings", href: "/delivery/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setIsLoading(false);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {isLoading && <LeafLoader />}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <div className="flex items-center gap-2 pb-4 pt-2">
                    <Image
                      src={logo}
                      alt="Green Thicks Logo"
                      width={120}
                      height={60}
                      className="h-8 w-auto"
                    />
                    <span className="text-lg font-semibold">Delivery Portal</span>
                  </div>
                  <nav className="grid gap-2 py-4">
                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={(e) => handleNavigation(e, item.href)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          pathname === item.href
                            ? "bg-muted font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              <Link
                href="/delivery/dashboard"
                onClick={(e) => handleNavigation(e, "/delivery/dashboard")}
                className="hidden items-center gap-2 lg:flex"
              >
                <Image
                  src={logo}
                  alt="Green Thicks Logo"
                  width={120}
                  height={60}
                  className="h-8 w-auto"
                />
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">Delivery</span>
                  <Bike className="h-5 w-5 text-primary" />
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/delivery/notifications"
                onClick={(e) => handleNavigation(e, "/delivery/notifications")}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                      <AvatarFallback>DP</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href="/delivery/profile"
                      onClick={(e) => handleNavigation(e, "/delivery/profile")}
                      className="flex w-full"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/delivery/settings"
                      onClick={(e) => handleNavigation(e, "/delivery/settings")}
                      className="flex w-full"
                    >
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/" onClick={(e) => handleNavigation(e, "/")} className="flex w-full">
                      Customer View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href="/delivery/login"
                      onClick={(e) => handleNavigation(e, "/delivery/login")}
                      className="flex w-full items-center text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 shrink-0 border-r lg:block">
            <div className="sticky top-16 overflow-auto p-4 h-[calc(100vh-4rem)]">
              <nav className="grid gap-2 py-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item.href)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      pathname === item.href
                        ? "bg-muted font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </>
  );
}