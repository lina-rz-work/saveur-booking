import styles from "./RestaurantHeader.module.css";

export function RestaurantHeader() {
  return (
    <header className={styles.header}>
      <a
        className={styles.brand}
        href="#main-content"
        aria-label="SAVEUR — к форме бронирования"
      >
        SAVEUR<span aria-hidden="true">.</span>
      </a>
      <p className={styles.headerNote}>Ресторан современной кухни</p>
    </header>
  );
}
