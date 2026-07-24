export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

export function scorePassword(pw) {
  if (!pw) return -1;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score - 1 < 0 ? 0 : score - 1, 3);
}

export function validateEmail(value) {
  return emailRegex.test(value);
}

export function validateUsername(value) {
  return usernameRegex.test(value);
}
