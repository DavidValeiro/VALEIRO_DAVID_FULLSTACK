export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function isValidImage(image) {
  if (typeof image !== 'string') return false;

  const value = image.trim();
  if (!value) return false;

  const payload = value.startsWith('data:')
    ? value.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, '')
    : value;

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(payload)) return false;
  if (payload.length % 4 !== 0) return false;

  return Buffer.from(payload, 'base64').length <= MAX_IMAGE_BYTES;
}
