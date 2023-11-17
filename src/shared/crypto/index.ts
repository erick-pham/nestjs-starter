import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  publicEncrypt,
  createCipheriv,
  createDecipheriv,
  privateDecrypt,
  createHash
} from 'crypto';
import * as fs from 'fs';
export const generateKey = (size = 16, format: BufferEncoding = 'hex') => {
  return randomBytes(size).toString(format);
};

export const generateSecretHash = (key: string) => {
  const salt = randomBytes(8).toString('hex');
  const buffer = scryptSync(key, salt, 64);
  return `${buffer.toString('hex')}.${salt}`;
};

export const compareKeys = (storedKey: string, suppliedKey: string) => {
  const [hashedPassword, salt] = storedKey.split('.');

  const buffer = scryptSync(suppliedKey, salt, 64);
  return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer);
};

export class MyRSA {
  PRIVATE_URL = `${process.cwd()}/src/shared/crypto/private.pem`;
  PUBLIC_URL = `${process.cwd()}/src/shared/crypto/public.pem`;

  generateKey() {
    return createHash('sha512')
      .update('secret_key')
      .digest('hex')
      .substring(0, 32);
  }

  generateEncryptionIV() {
    return createHash('sha512')
      .update('secret_iv')
      .digest('hex')
      .substring(0, 16);
  }

  encryptAES(data: string) {
    const cipher = createCipheriv(
      'aes-256-cbc',
      this.generateKey(),
      this.generateEncryptionIV()
    );
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
  }

  decryptAES(encryptedData: string) {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = createDecipheriv(
      'aes-256-cbc',
      this.generateKey(),
      this.generateEncryptionIV()
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  }

  encryptRSA(baseString: string) {
    const publicKey = fs.readFileSync(this.PUBLIC_URL, 'utf8');

    return publicEncrypt(publicKey, Buffer.from(baseString)).toString('hex');
  }

  decryptRSA(baseString: string) {
    const privateKey = fs.readFileSync(this.PRIVATE_URL, 'utf8');

    return privateDecrypt(privateKey, Buffer.from(baseString, 'hex')).toString(
      'utf8'
    );
  }
}
