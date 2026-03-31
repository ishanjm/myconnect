"use client";

import { useEffect, useState, useRef } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

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
    setIsMenuOpen(false);
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

      <div className="flex items-center gap-4">
        {mounted && user && (
          <div className="relative" ref={menuRef}>
            <button
              id="topbar-user-menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-accent bg-surface pr-3 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <img 
                id="topbar-user-avatar"
                src={user.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent((user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email))} 
                alt="Profile" 
                className="h-8 w-8 object-cover rounded-full"
              />
              <svg 
                className={`h-4 w-4 text-accent transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                id="topbar-user-dropdown"
                className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-border bg-surface shadow-2xl transition-all animate-in fade-in zoom-in duration-200"
              >
                {/* User Info Header */}
                <div className="border-b border-border p-4 bg-accent/5">
                  <p className="text-sm font-bold text-fg truncate">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-xs text-fg opacity-60 truncate">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                  {/* Theme Toggle Item */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-fg hover:bg-accent/10 transition-colors">
                    <span className="flex items-center gap-2">
                       {isDark ? "🌙" : "☀️"} Mode
                    </span>
                    <button
                      id="topbar-dropdown-theme-toggle"
                      onClick={toggleTheme}
                      className="flex cursor-pointer items-center gap-2 rounded-full border-none bg-transparent p-1 transition-all"
                      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                    >
                      <span className={`relative block h-5 w-9 rounded-full border-[1.5px] border-border transition-all duration-300 ${isDark ? "bg-accent" : "bg-border-border opacity-50"}`}>
                        <span className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-300 ${isDark ? "left-[calc(100%-1.05rem)]" : "left-[0.15rem]"}`} />
                      </span>
                    </button>
                  </div>

                  <div className="h-px bg-border my-1 mx-2" />

                  {/* Logout Item */}
                  <button
                    id="topbar-dropdown-logout-button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!user && !isLoading && mounted && (
           <a 
             id="topbar-login-link"
             href="/login" 
             className="px-4 py-1.5 rounded-lg bg-accent text-white font-semibold text-sm hover:opacity-90 transition-all active:scale-95"
           >
             Login
           </a>
        )}
      </div>
    </header>
  );
}
