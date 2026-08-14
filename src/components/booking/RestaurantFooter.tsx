import styles from "./RestaurantFooter.module.css";

export function RestaurantFooter() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} SAVEUR</span>
      <span>Бронь без предоплаты</span>
    </footer>
  );
}
