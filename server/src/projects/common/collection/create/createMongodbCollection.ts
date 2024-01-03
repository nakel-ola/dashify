import { MongoClient } from 'mongodb';

interface Args {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  collectionName: string;
}

export const createMongodbCollection = async (args: Args) => {
  const { host, name, username, password, collectionName } = args;

  const url = `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`;

  const client = new MongoClient(url);

  try {
    await client.connect();

    const database = client.db();

    await database.createCollection(collectionName);

    return { message: 'Collection created successfully' };
  } catch (error: any) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
};
