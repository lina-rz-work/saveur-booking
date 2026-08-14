export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}

export type BookingStatus = "idle" | "loading" | "success";

export type BookingField = keyof BookingFormData;

export type BookingErrors = Partial<Record<BookingField, string>>;
