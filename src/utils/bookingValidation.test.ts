import { describe, expect, it } from "vitest";

import { validatePhone } from "./bookingValidation";

describe("validatePhone", () => {
  it.each([
    "+79991234567",
    "89991234567",
    "+7 (999) 123-45-67",
    "8 999 123 45 67",
  ])("accepts valid Russian phone: %s", (phone) => {
    expect(validatePhone(phone)).toBeNull();
  });

  it.each(["+7999123456", "9991234567", "+19991234567", "phone"])(
    "rejects invalid phone: %s",
    (phone) => {
      expect(validatePhone(phone)).toBe("Введите номер в формате +7XXXXXXXXXX");
    },
  );
});
