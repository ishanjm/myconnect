"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest, meRequest } from "@/store/slices/auth";
import { RootState } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

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
    <header id="topbar" className="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-surface px-4 shadow-sm backdrop-blur-xl transition-all duration-300">
      {/* 1. Left Column: Brand (takes up left space) */}
      <div id="topbar-brand-section" className="flex flex-1 items-center gap-2">
        <Link href="/" id="topbar-brand" className="flex items-center gap-2 px-2 group cursor-pointer" title="Go to home">
          <span id="topbar-logo" className="text-[1.4rem] leading-none text-accent group-hover:scale-110 transition-transform">⬡</span>
          <span id="topbar-app-name" className="hidden lg:inline text-[1.05rem] font-bold tracking-tight text-fg group-hover:text-accent transition-colors">MyConnect</span>
        </Link>
      </div>

      {/* 2. Middle Column: Centered Navigation (icons only) */}
      <nav id="topbar-nav" className="flex h-full items-center gap-1 md:gap-2">
        <NavItem href="/" active={pathname === "/"} label="Home">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a2 2 0 002 2h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a2 2 0 002-2v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </NavItem>

        <NavItem href="/dashboard" active={pathname === "/dashboard"} label="Dashboard">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
            <path d="M8 15V11" strokeLinecap="round" /><path d="M12 15V8" strokeLinecap="round" /><path d="M16 15V13" strokeLinecap="round" />
          </svg>
        </NavItem>

        <NavItem href="/quiz" active={pathname === "/quiz"} label="Quiz">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </NavItem>

        <NavItem href="/docs" active={pathname === "/docs"} label="My Connects">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </NavItem>
      </nav>

      {/* 3. Right Column: User Menu (takes up right space) */}
      <div id="topbar-user-section" className="flex flex-1 items-center justify-end gap-2 md:gap-4 px-2">
        {mounted && user && (
          <>
            {/* Notification Trigger */}
            <button
              id="topbar-notifications-btn"
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-fg opacity-60 transition-all hover:bg-accent/10 hover:opacity-100 hover:scale-105 active:scale-95"
              title="Notifications"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Alert Badge */}
              <span className="absolute top-2.5 right-2.5 flex h-2 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2.5 bg-accent outline outline-2 outline-surface"></span>
              </span>
            </button>

            <div className="relative" ref={menuRef}>
            <button
              id="topbar-user-menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border-1.5 border-accent bg-surface p-0.5 pr-2 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <img
                id="topbar-user-avatar"
                src={user.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent((user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email))}
                alt="Profile"
                className="h-8 w-8 object-cover rounded-full transition-transform"
              />
              <svg
                className={`h-3.5 w-3.5 text-accent transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
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
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-fg truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {user.subscription || 'Trial'}
                    </span>
                  </div>
                  <p className="text-xs text-fg opacity-60 truncate">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                  {/* My Profile */}
                  <Link
                    id="topbar-dropdown-profile-link"
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-fg hover:bg-accent/10 transition-colors"
                  >
                    <span>👤</span> My Profile
                  </Link>

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
                      <span className={`relative block h-5 w-9 rounded-full border-[1.5px] border-border transition-all duration-300 ${isDark ? "bg-accent" : "bg-border opacity-50"}`}>
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
        </>
      )}

        {!user && !isLoading && mounted && (
          <Link
            id="topbar-login-link"
            href="/login"
            className="px-4 py-1.5 rounded-lg bg-accent text-white font-semibold text-sm hover:opacity-90 transition-all active:scale-95"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

const NavItem = ({ href, active, label, children }: { href: string; active: boolean; label: string; children: React.ReactNode }) => (
  <Link
    id={`topbar-nav-${label.toLowerCase()}`}
    href={href}
    className={`relative flex h-full items-center px-4 md:px-8 transition-all duration-200 border-b-[3px] ${active
      ? "text-accent border-accent bg-accent/5"
      : "text-fg border-transparent opacity-60 hover:opacity-100 hover:bg-accent/5"
      }`}
    title={label}
    aria-label={label}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {children}
    </div>
  </Link>
);
