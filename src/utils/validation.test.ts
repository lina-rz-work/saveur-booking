import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BookingFormData } from '@/types/booking';
import {
  formatPhone,
  validateDate,
  validateForm,
  validateGuests,
  validateName,
  validatePhone,
  validateTime,
} from '@/utils/validation';

describe('phone mask', () => {
  it('formats Russian numbers entered with 8 or without a country code', () => {
    expect(formatPhone('89991234567')).toBe('+7 (999) 123-45-67');
    expect(formatPhone('9991234567')).toBe('+7 (999) 123-45-67');
  });

  it('formats a number while it is being entered', () => {
    expect(formatPhone('99912')).toBe('+7 (999) 12');
  });

  it('allows deleting a digit next to an inserted separator', () => {
    expect(formatPhone('+7 (999) 123', '+7 (999) 123-')).toBe('+7 (999) 12');
  });
});

describe('field validation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 14, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates the guest name', () => {
    expect(validateName(' А ')).not.toBeNull();
    expect(validateName('Анна')).toBeNull();
  });

  it('validates the phone number', () => {
    expect(validatePhone('+7 (999) 123-45-67')).toBeNull();
    expect(validatePhone('+7 (999) 123-45')).not.toBeNull();
  });

  it('validates the date', () => {
    expect(validateDate('2026-08-13')).not.toBeNull();
    expect(validateDate('2026-02-30')).not.toBeNull();
    expect(validateDate('2026-08-14')).toBeNull();
    expect(validateDate('2026-08-15')).toBeNull();
  });

  it('validates known and occupied time slots', () => {
    expect(validateTime('11:00')).not.toBeNull();
    expect(validateTime('19:00', ['19:00'])).toContain('занято');
    expect(validateTime('19:00', ['18:00'])).toBeNull();
  });

  it('validates the number of guests', () => {
    expect(validateGuests(0)).not.toBeNull();
    expect(validateGuests(2.5)).not.toBeNull();
    expect(validateGuests(13)).not.toBeNull();
    expect(validateGuests(12)).toBeNull();
  });

  it('returns errors for every invalid form field', () => {
    const invalidForm: BookingFormData = {
      name: 'А',
      phone: '+7 (999) 123',
      date: '2026-08-13',
      time: '11:00',
      guests: 0,
    };

    expect(validateForm(invalidForm)).toEqual({
      name: expect.any(String),
      phone: expect.any(String),
      date: expect.any(String),
      time: expect.any(String),
      guests: expect.any(String),
    });
  });

  it('accepts a valid form and rejects a newly occupied slot', () => {
    const validForm: BookingFormData = {
      name: 'Анна',
      phone: '+7 (999) 123-45-67',
      date: '2026-08-15',
      time: '16:00',
      guests: 4,
    };

    expect(validateForm(validForm)).toEqual({});
    expect(
      validateForm(validForm, { occupiedTimeSlots: ['16:00'] }).time
    ).toContain('занято');
  });
});

