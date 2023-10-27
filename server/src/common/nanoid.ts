import { webcrypto as crypto } from 'node:crypto';

export const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

const POOL_SIZE_MULTIPLIER = 128;
let pool: Uint8Array, poolOffset: number;

function fillPool(bytes: number) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    crypto.getRandomValues(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
}

export function random(bytes: number): Uint8Array {
  fillPool((bytes -= 0));
  return pool.subarray(poolOffset - bytes, poolOffset);
}

export function customRandom(
  alphabet: string,
  defaultSize: number,
  getRandom: (bytes: number) => Uint8Array,
): () => string {
  const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
  const step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);

  return (size = defaultSize) => {
    let id = '';
    while (true) {
      const bytes = getRandom(step);
      let i = step;
      while (i--) {
        id += alphabet[bytes[i] & mask] || '';
        if (id.length === size) return id;
      }
    }
  };
}

export function customAlphabet(
  alphabet: string,
  size = 21,
): (size?: number) => string {
  return customRandom(alphabet, size, random);
}

export function nanoid(size = 21): string {
  fillPool((size -= 0));
  let id = '';
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
}
