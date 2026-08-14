import type { BookingFormData } from "@/types/booking";

import styles from "./Booking.module.css";

interface ConfirmationScreenProps {
  booking: BookingFormData;
  onRestart: () => void;
}

export function ConfirmationScreen({ booking, onRestart }: ConfirmationScreenProps) {
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${booking.date}T00:00:00`));

  return (
    <div className={`${styles.cardContent} ${styles.confirmation}`}>
      <div className={styles.successIcon} aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img">
          <path d="m8.5 16.5 5 5 10-11" />
        </svg>
      </div>

      <p className={styles.step}>02 / Подтверждение</p>
      <h2>Столик забронирован</h2>
      <p className={styles.confirmationLead}>
        {booking.name}, ждём вас! Детали бронирования уже готовы.
      </p>

      <dl className={styles.summary}>
        <div>
          <dt>Имя</dt>
          <dd>{booking.name}</dd>
        </div>
        <div>
          <dt>Дата</dt>
          <dd>{formattedDate}</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>{booking.time}</dd>
        </div>
        <div>
          <dt>Гости</dt>
          <dd>{booking.guests}</dd>
        </div>
      </dl>

      <button className={styles.secondaryButton} type="button" onClick={onRestart}>
        Забронировать ещё
      </button>
      <p className={styles.confirmationNote}>Если планы изменятся, позвоните нам заранее.</p>
    </div>
  );
}
