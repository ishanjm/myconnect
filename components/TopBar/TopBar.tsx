"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest, meRequest } from "@/store/slices/auth";
import { RootState } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, error, isLoading } = useSelector((state: RootState) => state.auth);
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const publicRoutes = ['/login', '/register', '/api/docs'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    // Only attempt to hydrate the session once on mount if no user is present
    if (!user && !isPublicRoute && !error) {
      dispatch(meRequest());
    }
  }, [dispatch, isPublicRoute]); // Removed user and error from deps to prevent re-triggering on logout

  // Redirect to login if user session is missing or invalid on a protected route
  useEffect(() => {
    if (!user && !isPublicRoute && !isLoading) {
      router.push('/login');
    }
  }, [user, isPublicRoute, isLoading, router]);

  const handleLogout = async () => {
    dispatch(logoutRequest());
  };

  return (
    <header id="topbar" className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface px-6 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div id="topbar-brand" className="flex items-center gap-2">
        <span id="topbar-logo" className="text-[1.4rem] leading-none text-accent">⬡</span>
        <span id="topbar-app-name" className="text-[1.05rem] font-bold tracking-tight text-fg">MyConnect</span>
      </div>

      <nav id="topbar-nav" className="flex items-center gap-1">
        <a id="topbar-nav-home" href="/" className="rounded-lg px-3 py-1.5 text-sm font-medium text-fg opacity-70 transition-all hover:bg-accent/10 hover:opacity-100">Home</a>
        <a id="topbar-nav-about" href="/about" className="rounded-lg px-3 py-1.5 text-sm font-medium text-fg opacity-70 transition-all hover:bg-accent/10 hover:opacity-100">About</a>
      </nav>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          id="topbar-theme-toggle"
          onClick={toggleTheme}
          className="flex cursor-pointer items-center gap-2 rounded-full border-none bg-transparent p-1 transition-all hover:bg-accent/10"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          <span className={`relative block h-5 w-9 rounded-full border-[1.5px] border-border transition-all duration-300 ${isDark ? "bg-accent" : "bg-border"}`}>
            <span className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-300 ${isDark ? "left-[calc(100%-1.05rem)]" : "left-[0.15rem]"}`} />
          </span>
          <span className="select-none text-base leading-none">{isDark ? "🌙" : "☀️"}</span>
        </button>

        {mounted && user && (
          <div id="topbar-user-info" className="flex items-center gap-3 border-l border-border pl-2">
            <img 
              id="topbar-user-avatar"
              src={user.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent((user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email))} 
              alt="Profile" 
              className="h-9 w-9 rounded-full border-2 border-accent bg-surface object-cover"
            />
            <button
              id="topbar-logout-button"
              onClick={handleLogout}
              className="ml-2 cursor-pointer rounded-lg border-none bg-accent px-4 py-1.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
