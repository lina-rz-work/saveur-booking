import type { BookingFormData } from "@/types/booking";

export const SUBMISSION_DELAY_MS = 1500;

export const TIME_SLOTS = Array.from(
  { length: 11 },
  (_, index) => `${index + 12}:00`,
);

export const GUEST_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => index + 1,
);

export const INITIAL_BOOKING: BookingFormData = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: 2,
};
