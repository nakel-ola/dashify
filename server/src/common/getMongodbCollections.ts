import { MongoClient } from 'mongodb';
import { Collection } from '../projects/types/collection.type';

interface Args {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export const getMongodbCollections = async (
  args: Args,
): Promise<Collection[]> => {
  const { host, name, username, password } = args;

  const url = `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`;

  const client = new MongoClient(url);

  try {
    await client.connect();

    const database = client.db();
    const collections = await database.listCollections().toArray();

    const results = [];

    for (const collection of collections) {
      const collectionName = collection.name;
      const sampleDocument = await database
        .collection(collectionName)
        .findOne();

      const schema = [];

      if (!sampleDocument) continue;

      for (const key in sampleDocument) {
        const value = sampleDocument[key];
        let valueType: any = { name: key, type: typeof value };

        if (key === '__v') continue;

        if (key === '_id') {
          valueType = { name: key, type: 'string' };
        } else if (value === null) {
          valueType = { name: key, type: 'null' };
        } else if (Array.isArray(value)) {
          const arrayType = getArrayType(value);
          valueType = { name: key, type: 'array', fields: arrayType };
        } else if (valueType.type === 'object' && value instanceof Date) {
          valueType = { name: key, type: 'Date' };
        } else if (valueType.type === 'object') {
          const objectType = getObjectFieldType(value);
          valueType = { name: key, type: 'object', fields: objectType };
        }

        schema.push(valueType);
      }

      results.push({ name: collectionName, icon: 'Settings', fields: schema });
    }

    return results;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
};

const getArrayType = (arr: any[]): any[] => {
  if (arr.length === 0) return [];

  const sampleValue = arr[0];
  let arrayType: any = typeof sampleValue;

  if (sampleValue === null) {
    arrayType = [];
  } else if (arrayType === 'object' && sampleValue instanceof Date) {
    arrayType = ['Date'];
  } else if (arrayType === 'object') {
    const objectType = getObjectFieldType(sampleValue);
    arrayType = objectType;
  }

  return arrayType;
};

const getObjectFieldType = (obj: object) => {
  const fieldTypes = [];

  for (const key in obj) {
    if (key === '__v') continue;

    fieldTypes.push({
      name: key,
      type: key === '_id' ? 'string' : typeof obj[key],
    });
  }

  return fieldTypes;
};
