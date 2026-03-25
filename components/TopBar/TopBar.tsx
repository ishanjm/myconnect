import styles from "./TopBar.module.css";

export default function TopBar() {
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
    </header>
  );
}
