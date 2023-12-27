import { MongoClient } from 'mongodb';

interface Args {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  collectionName: string;
  offset: number;
  limit: number;
}

export const getMongodbCollection = async (args: Args) => {
  const { host, name, username, password, collectionName, limit, offset } =
    args;

  const url = `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`;

  const client = new MongoClient(url);

  try {
    await client.connect();

    const database = client.db();

    const sampleDocument = await database
      .collection(collectionName)
      .find(
        {},
        {
          limit,
          skip: offset,
        },
      )
      .project({})
      .toArray();

    const totalItems = await database
      .collection(collectionName)
      .countDocuments();

    return { results: sampleDocument, totalItems };
  } catch (error: any) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
};
