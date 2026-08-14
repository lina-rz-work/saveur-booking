import { describe, expect, it } from 'vitest';
import { BookingFormData } from '@/types/booking';
import {
  formatPhoneInput,
  getBusySlots,
  getMaxBookingDateValue,
  getTodayDateValue,
  isDateInBookingRange,
  isValidDateInput,
  validateField,
  validateForm,
  validatePhone,
} from './validation';

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 30);

const baseForm: BookingFormData = {
  name: 'Иван Иванов',
  phone: '+7 (999) 123-45-67',
  date: getTodayDateValue(futureDate),
  time: '18:00',
  guests: 4,
};

describe('validatePhone', () => {
  it('принимает номер, начинающийся с +7', () => {
    expect(validatePhone('+79991234567')).toBeNull();
  });

  it('принимает номер, начинающийся с 8', () => {
    expect(validatePhone('89991234567')).toBeNull();
  });

  it('принимает номер с пробелами, скобками и дефисами', () => {
    expect(validatePhone('+7 (999) 123-45-67')).toBeNull();
  });

  it('отклоняет номер с недостаточным количеством цифр', () => {
    expect(validatePhone('+7999123456')).not.toBeNull();
  });

  it('отклоняет номер, начинающийся не с 7 или 8', () => {
    expect(validatePhone('+19991234567')).not.toBeNull();
  });

  it('отклоняет пустую строку', () => {
    expect(validatePhone('')).not.toBeNull();
  });
});

describe('formatPhoneInput', () => {
  it('форматирует цифры в маску +7 (XXX) XXX-XX-XX', () => {
    expect(formatPhoneInput('79991234567')).toBe('+7 (999) 123-45-67');
  });

  it('нормализует ведущую 8 в +7', () => {
    expect(formatPhoneInput('89991234567')).toBe('+7 (999) 123-45-67');
  });

  it('возвращает пустую строку для пустого ввода', () => {
    expect(formatPhoneInput('')).toBe('');
  });

  it('не восстанавливает закрывающую скобку при удалении номера', () => {
    const withoutBracket = formatPhoneInput('+7 (111)'.slice(0, -1));
    expect(withoutBracket).toBe('+7 (111');

    const withoutLastDigit = formatPhoneInput(withoutBracket.slice(0, -1));
    expect(withoutLastDigit).toBe('+7 (11');
  });
});

describe('isValidDateInput', () => {
  it('принимает существующую дату с четырёхзначным годом', () => {
    expect(isValidDateInput('2028-02-29')).toBe(true);
  });

  it('отклоняет год длиннее четырёх цифр', () => {
    expect(isValidDateInput('275760-08-14')).toBe(false);
  });

  it('отклоняет несуществующую календарную дату', () => {
    expect(isValidDateInput('2027-02-29')).toBe(false);
  });

  it('формирует сегодняшнюю дату в локальном часовом поясе', () => {
    expect(getTodayDateValue(new Date(2026, 7, 14))).toBe('2026-08-14');
  });

  it('ограничивает бронирование одним годом вперёд', () => {
    const now = new Date(2026, 7, 14);
    const minDate = getTodayDateValue(now);
    const maxDate = getMaxBookingDateValue(now);

    expect(maxDate).toBe('2027-08-14');
    expect(isDateInBookingRange('2027-08-14', minDate, maxDate)).toBe(true);
    expect(isDateInBookingRange('2027-08-15', minDate, maxDate)).toBe(false);
    expect(isDateInBookingRange('5555-08-14', minDate, maxDate)).toBe(false);
  });
});

describe('validateField: name', () => {
  it('отклоняет имя короче 2 символов', () => {
    const error = validateField('name', { ...baseForm, name: 'И' });
    expect(error).not.toBeNull();
  });

  it('принимает корректное имя', () => {
    expect(validateField('name', baseForm)).toBeNull();
  });
});

describe('validateField: date', () => {
  it('отклоняет пустую дату', () => {
    expect(validateField('date', { ...baseForm, date: '' })).not.toBeNull();
  });

  it('отклоняет дату в прошлом', () => {
    expect(validateField('date', { ...baseForm, date: '2000-01-01' })).not.toBeNull();
  });

  it('принимает будущую дату', () => {
    expect(validateField('date', baseForm)).toBeNull();
  });

  it('отклоняет год длиннее четырёх цифр', () => {
    expect(
      validateField('date', { ...baseForm, date: '275760-08-14' })
    ).not.toBeNull();
  });

  it('отклоняет несуществующую дату', () => {
    expect(
      validateField('date', { ...baseForm, date: '2099-02-29' })
    ).not.toBeNull();
  });

  it('отклоняет дату дальше одного года от текущей', () => {
    expect(
      validateField('date', { ...baseForm, date: '5555-08-14' })
    ).not.toBeNull();
  });
});

describe('validateField: time', () => {
  it('отклоняет значение не из списка слотов', () => {
    expect(validateField('time', { ...baseForm, time: '11:30' })).not.toBeNull();
  });

  it('отклоняет занятый слот для выбранной даты', () => {
    const busy = getBusySlots(baseForm.date);
    expect(busy.length).toBeGreaterThan(0);
    expect(
      validateField('time', { ...baseForm, time: busy[0] })
    ).not.toBeNull();
  });

  it('принимает свободный слот', () => {
    const busy = getBusySlots(baseForm.date);
    const free = '18:00' === busy[0] || '18:00' === busy[1] ? '19:00' : '18:00';
    expect(validateField('time', { ...baseForm, time: free })).toBeNull();
  });
});

describe('validateField: guests', () => {
  it('отклоняет 0 гостей', () => {
    expect(validateField('guests', { ...baseForm, guests: 0 })).not.toBeNull();
  });

  it('отклоняет больше 12 гостей', () => {
    expect(validateField('guests', { ...baseForm, guests: 13 })).not.toBeNull();
  });

  it('принимает значение в диапазоне 1-12', () => {
    expect(validateField('guests', { ...baseForm, guests: 6 })).toBeNull();
  });
});

describe('validateForm', () => {
  it('не возвращает ошибок для полностью корректной формы', () => {
    const busy = getBusySlots(baseForm.date);
    const time = busy.includes('18:00') ? '19:00' : '18:00';
    expect(validateForm({ ...baseForm, time })).toEqual({});
  });

  it('возвращает ошибки по всем невалидным полям', () => {
    const errors = validateForm({
      name: 'A',
      phone: '123',
      date: '',
      time: '',
      guests: 0,
    });
    expect(Object.keys(errors).sort()).toEqual(
      ['date', 'guests', 'name', 'phone', 'time'].sort()
    );
  });
});
