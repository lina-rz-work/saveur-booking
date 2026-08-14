import { describe, expect, it } from 'vitest';
import { BookingFormData } from '@/types/booking';
import {
  formatPhoneInput,
  getBusySlots,
  validateField,
  validateForm,
  validatePhone,
} from './validation';

const baseForm: BookingFormData = {
  name: 'Иван Иванов',
  phone: '+7 (999) 123-45-67',
  date: '2099-01-01',
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
    expect(validateField('date', { ...baseForm, date: '2099-01-01' })).toBeNull();
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
