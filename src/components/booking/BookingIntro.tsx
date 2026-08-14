import styles from "./BookingIntro.module.css";

export function BookingIntro() {
  return (
    <section className={styles.intro} aria-labelledby="page-title">
      <p className={styles.eyebrow}>Онлайн-бронирование</p>
      <h1 id="page-title">Ваш столик уже почти готов</h1>
      <p className={styles.lead}>
        Выберите удобные дату и время — мы сохраним столик и подтвердим бронь за
        несколько секунд.
      </p>

      <dl className={styles.details}>
        <div>
          <dt>Часы работы</dt>
          <dd>12:00–23:00</dd>
        </div>
        <div>
          <dt>Адрес</dt>
          <dd>ул. Большая Никитская, 12</dd>
        </div>
      </dl>
    </section>
  );
}
