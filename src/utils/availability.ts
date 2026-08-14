export const TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

// Демонстрационное расписание занятости. В реальном приложении эту функцию
// можно заменить запросом к API, не меняя компонент формы.
const OCCUPIED_BY_WEEKDAY: Record<number, readonly TimeSlot[]> = {
  0: ['13:00', '14:00', '19:00', '20:00'],
  1: ['13:00', '18:00'],
  2: ['12:00', '19:00'],
  3: ['14:00', '18:00', '20:00'],
  4: ['13:00', '19:00', '21:00'],
  5: ['18:00', '19:00', '20:00', '21:00'],
  6: ['17:00', '18:00', '19:00', '20:00'],
};

function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function getOccupiedTimeSlots(dateValue: string): readonly TimeSlot[] {
  const date = parseDateInput(dateValue);
  return date ? OCCUPIED_BY_WEEKDAY[date.getDay()] : [];
}

