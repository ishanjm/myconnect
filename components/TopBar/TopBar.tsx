"use client";

import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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
    </header>
  );
}
