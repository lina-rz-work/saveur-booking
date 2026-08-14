export function getGuestLabel(count: number): string {
  if (count === 1) return "гость";
  if (count >= 2 && count <= 4) return "гостя";
  return "гостей";
}

export function formatBookingDate(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
