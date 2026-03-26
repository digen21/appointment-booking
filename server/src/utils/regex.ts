export const EMAIL_REGEX =
  /^(?!.*\.\.)[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;
export const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const SLOT_REGEX =
  /^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/;
