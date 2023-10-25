const hexToHSL = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result![1], 16);
  let g = parseInt(result![2], 16);
  let b = parseInt(result![3], 16);
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number = 0,
    s: number,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  const HSL: { [key: string]: number } = {};
  HSL["h"] = h * 360;
  HSL["s"] = s * 100;
  HSL["l"] = l * 100;
  return HSL;
};

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const whereToStart = (value: number, type: string) => {
  if (type === "s") {
    let values: number[] = [];
    let first = 97;
    for (let i = 0; i < 10; i++) {
      if (i > 0) {
        first -= 7.4;
      }
      values.push(first);
    }

    const closest = values.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });

    const start = values.indexOf(closest);

    return start;
  }
};

const getHSL = (raw: string) => {
  const colors: { [key: string]: Array<{ [key: string]: number }> } = {};
  raw.split("colors.").forEach((colorSet) => {
    const hexes = colorSet.match(/#[A-Z0-9]+/g);
    if (!hexes?.length) return;
    colors[colorSet.split("\n")[0]] = colorSet
      .match(/#[A-Z0-9]+/g)!
      .map((color) => hexToHSL(color));
  });

  return colors;
};

const calc = (
  hsls: { [key: string]: Array<{ [key: string]: number }> },
  key: string
) => {
  const keys = Object.keys(hsls);
  const totalDiff: { [key: string]: number } = {};

  keys.forEach((set, index) => {
    let diff = 0;
    hsls[set].forEach((color, index) => {
      if (hsls[set][index + 1]) {
        diff += color[key] - hsls[set][index + 1][key];
      }
    });
    totalDiff[set] = diff / 10;
  });

  totalDiff.total = Object.values(totalDiff).reduce((a, b) => a + b) / 22;
  totalDiff.start =
    Object.keys(hsls)
      .map((set) => hsls[set][0][key])
      .reduce((a, b) => a + b) / 22;
  totalDiff.end =
    Object.keys(hsls)
      .map((set) => hsls[set][hsls[set].length - 1][key])
      .reduce((a, b) => a + b) / 22;

  return totalDiff;
};

const shade = (
  color: string,
  saturationFactor: number = 1.771968374684816,
  lightFactor: number = 7.3903743315508015
) => {
  let s = saturationFactor;
  let l = lightFactor;
  let hsl = hexToHSL(color);
  let start = whereToStart(hsl.l, "s")!;
  let currentS = hsl.s;
  let currentL = hsl.l;
  let globalCount = 0;
  let final: string[] = [];

  for (let i = 0; i < 10 - start; i++) {
    globalCount++;
    if (i !== 0) {
      currentS -= s;
      currentL -= l;
    }
    final.push(hslToHex(hsl.h, currentS, currentL));
  }

  if (globalCount < 10) {
    let ogS = hsl.s;
    let ogL = hsl.l;
    for (let i = 1; i < 11 - globalCount; i++) {
      if (ogS + s <= 100) ogS += s;
      else ogS = 100;
      if (ogL + l <= 100) ogL += l;
      else ogL = 100;
      final.unshift(hslToHex(hsl.h, ogS, ogL));
    }
  }

  return final;
};

export { shade };
