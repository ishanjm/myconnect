"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest, meRequest } from "@/store/slices/auth";
import { RootState } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, error, isLoading } = useSelector((state: RootState) => state.auth);
  const isDark = theme === "dark";

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
    <header id="topbar" className={styles.topbar}>
      <div id="topbar-brand" className={styles.brand}>
        <span id="topbar-logo" className={styles.logo}>⬡</span>
        <span id="topbar-app-name" className={styles.appName}>MyConnect</span>
      </div>

      <nav id="topbar-nav" className={styles.nav}>
        <a id="topbar-nav-home" href="/" className={styles.navLink}>Home</a>
        <a id="topbar-nav-about" href="/about" className={styles.navLink}>About</a>
      </nav>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          id="topbar-theme-toggle"
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          <span className={styles.toggleTrack} data-dark={isDark ? "true" : "false"}>
            <span className={styles.toggleThumb} />
          </span>
          <span className={styles.toggleIcon}>{isDark ? "🌙" : "☀️"}</span>
        </button>

        {user && (
          <button
            id="topbar-logout-button"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
