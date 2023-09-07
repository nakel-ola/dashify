import { randomFillSync } from "crypto";

const urlAlphabet =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

const POOL_SIZE_MULTIPLIER = 128;
let pool: any, poolOffset: number;

let fillPool = (bytes: number) => {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    randomFillSync(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    randomFillSync(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
};

let random = (bytes: number) => {
  fillPool((bytes -= 0));
  return pool.subarray(poolOffset - bytes, poolOffset);
};

let customRandom = (
  alphabet: string,
  defaultSize: number,
  getRandom: (step: number) => number[]
) => {
  let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
  let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length);

  return (size = defaultSize) => {
    let id = "";

    while (true) {
      let bytes = getRandom(step);
      let i = step;

      while (i--) {
        id += alphabet[bytes[i] & mask] || "";
        if (id.length === size) return id;
      }
    }
  };
};

let customAlphabet = (alphabet: string, size: number = 21) =>
  customRandom(alphabet, size, random);

let nanoid = (size = 21, alphabet?: string) => {
  fillPool((size -= 0));
  let id = "";

  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += (alphabet ?? urlAlphabet)[
      pool[i] & (alphabet ? alphabet.length - 1 : 63)
    ];
  }
  return id;
};

let nanoidV2 = (alphabet: string, size = 21, length: number = 63) => {
  fillPool((size -= 0));
  let id = "";
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += alphabet[pool[i] & length];
  }
  return id;
};

export { customAlphabet, customRandom, nanoid, nanoidV2, random, urlAlphabet };
