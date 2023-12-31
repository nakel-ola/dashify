import * as crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const tagLength = 16;
const defaultSaltLength = 64;
const defaultPbkdf2Iterations = 100000;

type Options = { pbkdf2Iterations?: number; saltLength?: number };

export default function Cryptr(secret: string, options?: Options) {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Cryptr: secret must be a non-0-length string');
  }

  let saltLength = defaultSaltLength;
  let pbkdf2Iterations = defaultPbkdf2Iterations;

  if (options) {
    if (options.pbkdf2Iterations) {
      pbkdf2Iterations = options.pbkdf2Iterations;
    }

    if (options.saltLength) {
      saltLength = options.saltLength;
    }
  }

  const tagPosition = saltLength + ivLength;
  const encryptedPosition = tagPosition + tagLength;

  function getKey(salt) {
    return crypto.pbkdf2Sync(secret, salt, pbkdf2Iterations, 32, 'sha512');
  }

  this.encrypt = function encrypt(value: string) {
    if (value == null) throw new Error('value must not be null or undefined');

    const iv = crypto.randomBytes(ivLength);
    const salt = crypto.randomBytes(saltLength);

    const key = getKey(salt);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(String(value), 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
  };

  this.decrypt = function decrypt(value: string) {
    if (value == null) {
      throw new Error('value must not be null or undefined');
    }

    const stringValue = Buffer.from(String(value), 'hex');

    const salt = stringValue.slice(0, saltLength);
    const iv = stringValue.slice(saltLength, tagPosition);
    const tag = stringValue.slice(tagPosition, encryptedPosition);
    const encrypted = stringValue.slice(encryptedPosition);

    const key = getKey(salt);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final('utf8');
  };
}
