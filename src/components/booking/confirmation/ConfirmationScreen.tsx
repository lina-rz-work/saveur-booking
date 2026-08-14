import type { BookingFormData } from "@/types/booking";
import { formatBookingDate } from "@/utils/bookingFormat";

import styles from "./ConfirmationScreen.module.css";

interface ConfirmationScreenProps {
  booking: BookingFormData;
  onRestart: () => void;
}

export function ConfirmationScreen({
  booking,
  onRestart,
}: ConfirmationScreenProps) {
  return (
    <div className={styles.content}>
      <div className={styles.successIcon} aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path d="m8.5 16.5 5 5 10-11" />
        </svg>
      </div>

      <p className={styles.step}>02 / Подтверждение</p>
      <h2>Столик забронирован</h2>
      <p className={styles.lead}>
        {booking.name}, ждём вас! Детали бронирования уже готовы.
      </p>

      <dl className={styles.summary}>
        <SummaryItem label="Имя" value={booking.name} />
        <SummaryItem label="Дата" value={formatBookingDate(booking.date)} />
        <SummaryItem label="Время" value={booking.time} />
        <SummaryItem label="Гости" value={String(booking.guests)} />
      </dl>

      <button className={styles.button} type="button" onClick={onRestart}>
        Забронировать ещё
      </button>
      <p className={styles.note}>
        Если планы изменятся, позвоните нам заранее.
      </p>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
