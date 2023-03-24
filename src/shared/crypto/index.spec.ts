import { generateKey, generateSecretHash, compareKeys } from '.';

test('generateKey should return a string of specified size and format', () => {
  const key = generateKey(16, 'hex');
  expect(typeof key).toBe('string');
  expect(key.length).toBe(32);
});

test('generateSecretHash should return a string with hashed password and salt', () => {
  const key = 'password';
  const hash = generateSecretHash(key);
  expect(typeof hash).toBe('string');
  expect(hash.split('.').length).toBe(2);
});

test('compareKeys should return true if supplied key matches stored key', () => {
  const key = 'password';
  const storedKey = generateSecretHash(key);
  const result = compareKeys(storedKey, key);
  expect(result).toBe(true);
});

test('compareKeys should return false if supplied key does not match stored key', () => {
  const key = 'password';
  const storedKey = generateSecretHash(key);
  const result = compareKeys(storedKey, 'wrongpassword');
  expect(result).toBe(false);
});
