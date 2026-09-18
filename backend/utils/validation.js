export function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}
export function requiredText(value, label, max = 200) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max)
    fail(`${label} is required and must be under ${max} characters.`);
  return value.trim();
}
export function credentials(body) {
  const email = requiredText(body.email, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Enter a valid email address.');
  if (
    typeof body.password !== 'string' ||
    body.password.length < 8 ||
    Buffer.byteLength(body.password) > 72
  )
    fail('Password must be at least 8 characters and at most 72 bytes.');
  return { email, password: body.password };
}
