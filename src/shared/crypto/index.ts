import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export const generateKey = (size = 16, format: BufferEncoding = 'hex') => {
  return randomBytes(size).toString(format);
};

export const generateSecretHash = (key: string) => {
  const salt = randomBytes(8).toString('hex');
  const buffer = scryptSync(key, salt, 64) as Buffer;
  return `${buffer.toString('hex')}.${salt}`;
};

export const compareKeys = (storedKey: string, suppliedKey: string) => {
  const [hashedPassword, salt] = storedKey.split('.');

  const buffer = scryptSync(suppliedKey, salt, 64) as Buffer;
  return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer);
};
