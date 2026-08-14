"use client";

import { useEffect, useState } from "react";

import type { BookingFormData, BookingStatus } from "@/types/booking";
import { getLocalDateString } from "@/utils/bookingValidation";

import { BookingForm } from "./BookingForm";
import { ConfirmationScreen } from "./ConfirmationScreen";
import styles from "./Booking.module.css";

export function BookingExperience() {
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [booking, setBooking] = useState<BookingFormData | null>(null);
  const [today, setToday] = useState(getLocalDateString);

  useEffect(() => {
    const dateTimerId = window.setTimeout(() => {
      setToday(getLocalDateString());
    }, 0);

    return () => window.clearTimeout(dateTimerId);
  }, []);

  useEffect(() => {
    if (status !== "loading") return;

    const timerId = window.setTimeout(() => {
      setStatus("success");
    }, 1500);

    return () => window.clearTimeout(timerId);
  }, [status]);

  function handleSubmit(data: BookingFormData) {
    setBooking(data);
    setStatus("loading");
  }

  function handleRestart() {
    setBooking(null);
    setStatus("idle");
  }

  const isSuccess = status === "success" && booking;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="#main-content" aria-label="SAVEUR — к форме бронирования">
          SAVEUR<span aria-hidden="true">.</span>
        </a>
        <p className={styles.headerNote}>Ресторан современной кухни</p>
      </header>

      <div id="main-content" className={styles.layout}>
        <section className={styles.intro} aria-labelledby="page-title">
          <p className={styles.eyebrow}>Онлайн-бронирование</p>
          <h1 id="page-title">Ваш столик уже почти готов</h1>
          <p className={styles.lead}>
            Выберите удобные дату и время — мы сохраним столик и подтвердим бронь
            за несколько секунд.
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

        <section className={styles.card} aria-live="polite">
          {isSuccess ? (
            <ConfirmationScreen booking={booking} onRestart={handleRestart} />
          ) : (
            <BookingForm
              today={today}
              isLoading={status === "loading"}
              onSubmit={handleSubmit}
            />
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} SAVEUR</span>
        <span>Бронь без предоплаты</span>
      </footer>
    </main>
  );
}
