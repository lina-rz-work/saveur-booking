"use client";

import { useEffect, useState } from "react";

import { SUBMISSION_DELAY_MS } from "@/config/booking";
import type { BookingFormData, BookingStatus } from "@/types/booking";
import { getLocalDateString } from "@/utils/bookingValidation";

import { BookingForm } from "./form/BookingForm";
import { ConfirmationScreen } from "./confirmation/ConfirmationScreen";
import { BookingIntro } from "./BookingIntro";
import { RestaurantFooter } from "./RestaurantFooter";
import { RestaurantHeader } from "./RestaurantHeader";
import styles from "./BookingExperience.module.css";

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

    const submissionTimerId = window.setTimeout(() => {
      setStatus("success");
    }, SUBMISSION_DELAY_MS);

    return () => window.clearTimeout(submissionTimerId);
  }, [status]);

  function handleSubmit(data: BookingFormData) {
    setBooking(data);
    setStatus("loading");
  }

  function handleRestart() {
    setBooking(null);
    setStatus("idle");
  }

  return (
    <main className={styles.page}>
      <RestaurantHeader />

      <div id="main-content" className={styles.layout}>
        <BookingIntro />

        <section className={styles.card} aria-live="polite">
          {status === "success" && booking ? (
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

      <RestaurantFooter />
    </main>
  );
}
