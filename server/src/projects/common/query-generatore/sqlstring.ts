const ID_GLOBAL_REGEXP = /`/g;
const QUAL_GLOBAL_REGEXP = /\./g;
const CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
const CHARS_ESCAPE_MAP = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
  '\x1a': '\\Z',
  '"': '\\"',
  "'": "''",
  '\\': '\\\\',
};

export function escapeId(val: any, forbidQualified?: boolean): string {
  if (Array.isArray(val)) {
    let sql = '';

    for (let i = 0; i < val.length; i++) {
      sql += (i === 0 ? '' : ', ') + escapeId(val[i], forbidQualified);
    }

    return sql;
  } else if (forbidQualified) {
    return '`' + String(val).replace(ID_GLOBAL_REGEXP, '``') + '`';
  } else {
    return (
      '`' +
      String(val)
        .replace(ID_GLOBAL_REGEXP, '``')
        .replace(QUAL_GLOBAL_REGEXP, '`.`') +
      '`'
    );
  }
}

export function escape(
  val: any,
  stringifyObjects?: boolean,
  timeZone?: string,
): string {
  if (val === undefined || val === null) return 'NULL';

  switch (typeof val) {
    case 'boolean':
      return val ? 'true' : 'false';
    case 'number':
      return val + '';
    case 'object':
      if (Object.prototype.toString.call(val) === '[object Date]') {
        return dateToString(val, timeZone || 'local');
      } else if (Array.isArray(val)) {
        return arrayToList(val, timeZone);
      } else if (Buffer.isBuffer(val)) {
        return bufferToString(val);
      } else if (typeof val.toSqlString === 'function') {
        return String(val.toSqlString());
      } else if (stringifyObjects) {
        return escapeString(val.toString());
      } else {
        return objectToValues(val, timeZone);
      }
    default:
      return escapeString(val);
  }
}

export function arrayToList(array: any[], timeZone?: string): string {
  let sql = '';

  for (let i = 0; i < array.length; i++) {
    const val = array[i];

    if (Array.isArray(val)) {
      sql += (i === 0 ? '' : ', ') + '(' + arrayToList(val, timeZone) + ')';
    } else {
      sql += (i === 0 ? '' : ', ') + escape(val, true, timeZone);
    }
  }

  return sql;
}

export function format(
  sql: string,
  values?: any[],
  stringifyObjects?: boolean,
  timeZone?: string,
): string {
  if (values == null) {
    return sql;
  }

  if (!Array.isArray(values)) {
    values = [values];
  }

  let chunkIndex = 0;
  const placeholdersRegex = /\?+/g;
  let result = '';
  let valuesIndex = 0;
  let match;

  while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
    const len = match[0].length;

    if (len > 2) {
      continue;
    }

    const value =
      len === 2
        ? escapeId(values[valuesIndex])
        : escape(values[valuesIndex], stringifyObjects, timeZone);

    result += sql.slice(chunkIndex, match.index) + value;
    chunkIndex = placeholdersRegex.lastIndex;
    valuesIndex++;
  }

  if (chunkIndex === 0) {
    // Nothing was replaced
    return sql;
  }

  if (chunkIndex < sql.length) {
    return result + sql.slice(chunkIndex);
  }

  return result;
}

export function dateToString(date: Date, timeZone?: string): string {
  const dt = new Date(date);

  if (isNaN(dt.getTime())) {
    return 'NULL';
  }

  let year;
  let month;
  let day;
  let hour;
  let minute;
  let second;
  let millisecond;

  if (timeZone === 'local') {
    year = dt.getFullYear();
    month = dt.getMonth() + 1;
    day = dt.getDate();
    hour = dt.getHours();
    minute = dt.getMinutes();
    second = dt.getSeconds();
    millisecond = dt.getMilliseconds();
  } else {
    const tz = convertTimezone(timeZone);

    if (tz !== false && tz !== 0) {
      dt.setTime(dt.getTime() + tz * 60000);
    }

    year = dt.getUTCFullYear();
    month = dt.getUTCMonth() + 1;
    day = dt.getUTCDate();
    hour = dt.getUTCHours();
    minute = dt.getUTCMinutes();
    second = dt.getUTCSeconds();
    millisecond = dt.getUTCMilliseconds();
  }

  // YYYY-MM-DD HH:mm:ss.mmm
  const str =
    zeroPad(year, 4) +
    '-' +
    zeroPad(month, 2) +
    '-' +
    zeroPad(day, 2) +
    ' ' +
    zeroPad(hour, 2) +
    ':' +
    zeroPad(minute, 2) +
    ':' +
    zeroPad(second, 2) +
    '.' +
    zeroPad(millisecond, 3);

  return escapeString(str);
}

export function bufferToString(buffer: Buffer): string {
  return 'X' + escapeString(buffer.toString('hex'));
}

export function objectToValues(object: any, timeZone?: string): string {
  let sql = '';

  for (const key in object) {
    const val = object[key];

    if (typeof val === 'function') {
      continue;
    }

    sql +=
      (sql.length === 0 ? '' : ', ') +
      escapeId(key) +
      ' = ' +
      escape(val, true, timeZone);
  }

  return sql;
}

export function raw(sql: string): { toSqlString: () => string } {
  if (typeof sql !== 'string') {
    throw new TypeError('argument sql must be a string');
  }

  return {
    toSqlString: function toSqlString() {
      return sql;
    },
  };
}

function escapeString(val: string): string {
  let chunkIndex = (CHARS_GLOBAL_REGEXP.lastIndex = 0);
  let escapedVal = '';
  let match;

  while ((match = CHARS_GLOBAL_REGEXP.exec(val))) {
    escapedVal +=
      val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
    chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
  }

  if (chunkIndex === 0) {
    // Nothing was escaped
    return "'" + val + "'";
  }

  if (chunkIndex < val.length) {
    return "'" + escapedVal + val.slice(chunkIndex) + "'";
  }

  return "'" + escapedVal + "'";
}

function zeroPad(number: number | string, length: number): string {
  number = number.toString();
  while (number.length < length) {
    number = '0' + number;
  }

  return number;
}

function convertTimezone(tz: string): number | false {
  if (tz === 'Z') {
    return 0;
  }

  const m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    return (
      (m[1] === '-' ? -1 : 1) *
      (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) *
      60
    );
  }
  return false;
}
