import styles from './ConfirmationScreen.module.css';
import { BookingFormData } from '@/types/booking';

interface ConfirmationScreenProps {
  data: BookingFormData;
  onReset: () => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function guestsLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'гость';
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'гостя';
  return 'гостей';
}

export default function ConfirmationScreen({ data, onReset }: ConfirmationScreenProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>✓</div>
      <h1 className="title">Столик забронирован</h1>
      <p className="subtitle">Мы ждём вас в назначенное время</p>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Имя</span>
          <span className={styles.rowValue}>{data.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Дата</span>
          <span className={styles.rowValue}>{formatDate(data.date)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Время</span>
          <span className={styles.rowValue}>{data.time}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Гости</span>
          <span className={styles.rowValue}>
            {data.guests} {guestsLabel(data.guests)}
          </span>
        </div>
      </div>

      <button className={styles.button} onClick={onReset}>
        Забронировать ещё
      </button>
    </div>
  );
}
