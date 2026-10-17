import crypto from 'node:crypto';

// scrypt parametreleri (Node önerileri): N=16384, r=8, p=1, 32 bayt anahtar
const N = 16384;
const R = 8;
const P = 1;
const KEY_LEN = 32;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, KEY_LEN, { N, r: R, p: P });
  return `scrypt:${N}:${R}:${P}:${salt.toString('hex')}:${key.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const parts = stored.split(':');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, nStr, rStr, pStr, saltHex, keyHex] = parts;
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(keyHex, 'hex');
    const actual = crypto.scryptSync(password, salt, expected.length, {
      N: Number(nStr),
      r: Number(rStr),
      p: Number(pStr),
    });
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
