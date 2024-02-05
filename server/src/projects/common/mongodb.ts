import { MongoClient, Collection as MongodbCollection } from 'mongodb';
import { getMongodbArrayType, getMongodbObjectFieldType } from './utils';
import { Collection, Fields } from '../types/project.type';
import { v4 } from 'uuid';
import { mongodbFilter, mongodbSort } from './mongodb-query';
import { InternalServerErrorException } from '@nestjs/common';

type ConnectionOption = {
  name: string;
  host: string;
  ssl: boolean;
  username: string;
  password: string;
};

type GetCollectionArgs = {
  collectionName: string;
  offset: number;
  limit: number;
  filter?: string;
  sort?: string;
};

type CreateDocumentArgs = {
  collectionName: string;
  data: {
    name: string;
    value: any;
  }[];
};

type UpdateDocumentArgs = {
  collectionName: string;
  set: {
    name: string;
    value: string;
  }[];
  where: {
    name: string;
    value: string;
  };
};

type DeleteDocumentArgs = {
  collectionName: string;
  deleteAll?: boolean | string;
  where?: {
    name: string;
    value: string;
  }[];
};

type ChangeCollectionNameArgs = {
  collectionName: string;
  newCollectionName: string;
};

type DuplicateCollectionArgs = {
  collectionName: string;
  duplicateName: string;
  withData?: boolean;
};

export class MongoDatabase {
  private client: MongoClient;

  constructor(connectionOption: ConnectionOption) {
    const { host, name, username, password, ssl } = connectionOption;
    const url = `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`;

    this.connect(url, ssl);
  }

  private async connect(connectionString: string, ssl: boolean): Promise<void> {
    try {
      this.client = new MongoClient(connectionString, { ssl });
      await this.client.connect();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async createCollection(
    collectionName: string,
  ): Promise<{ message: string }> {
    try {
      const db = this.client.db();
      await db.createCollection(collectionName);

      return { message: 'Collection created successfull' };
    } catch (error) {
      console.error(`Error creating collection '${collectionName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async getCollections(): Promise<Collection[]> {
    try {
      const db = this.client.db();

      const collections = await db.listCollections().toArray();

      const results: Collection[] = [];

      for (const collection of collections) {
        const collectionName = collection.name;
        const sampleDocument = await db.collection(collectionName).findOne();

        const schema = [];

        if (!sampleDocument) {
          results.push({
            name: collectionName,
            icon: 'Settings',
            fields: schema,
          });
          continue;
        }

        for (const key in sampleDocument) {
          const value = sampleDocument[key];

          const id = v4();
          let valueType: Fields = {
            id,
            name: key,
            type: typeof value,
            dataType: typeof value,
            udtName: typeof value,
          };

          if (key === '__v') continue;

          if (key === '_id') {
            valueType = {
              id,
              name: key,
              type: 'string',
              dataType: 'string',
              defaultValue: null,
              isArray: false,
              isNullable: false,
              isIdentify: false,
            };
          } else if (value === null) {
            valueType = {
              id,
              name: key,
              type: 'null',
              dataType: 'null',
              udtName: 'null',
              defaultValue: null,
              isArray: false,
              isNullable: false,
              isIdentify: false,
            };
          } else if (Array.isArray(value)) {
            const arrayType = getMongodbArrayType(value);
            valueType = {
              id,
              name: key,
              type: 'array',
              dataType: 'array',
              fields: arrayType,
              udtName: 'array',
              defaultValue: null,
              isArray: true,
              isNullable: false,
              isIdentify: false,
            };
          } else if (valueType.type === 'object' && value instanceof Date) {
            valueType = {
              id,
              name: key,
              type: 'Date',
              dataType: 'Date',
              udtName: 'Date',
              defaultValue: null,
              isArray: false,
              isNullable: false,
              isIdentify: false,
            };
          } else if (valueType.type === 'object') {
            const objectType = getMongodbObjectFieldType(value);
            valueType = {
              id,
              name: key,
              type: 'object',
              dataType: 'object',
              udtName: 'object',
              fields: objectType,
              defaultValue: null,
              isArray: false,
              isNullable: false,
              isIdentify: false,
            };
          }

          schema.push(valueType);
        }

        results.push({
          name: collectionName,
          icon: 'Settings',
          fields: schema,
        });
      }

      return results;
    } catch (error) {
      console.error(`Error getting collections:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async getCollection(args: GetCollectionArgs) {
    const { collectionName, limit, offset, sort, filter } = args;
    try {
      const db = this.client.db();

      const collection = db.collection(collectionName);

      const results = await collection
        .find(mongodbFilter(filter), {
          limit,
          skip: offset,
          sort: mongodbSort(sort),
        })
        .project({})
        .toArray();

      const totalItems = await collection.countDocuments();

      return { results, totalItems };
    } catch (error) {
      console.error(`Error getting collection '${collectionName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async createDocument(args: CreateDocumentArgs) {
    const { collectionName, data } = args;

    try {
      const db = this.client.db();

      const collection = db.collection(collectionName);

      const dataObject = data.reduce((acc, obj) => {
        acc[obj.name] = obj.value;
        return acc;
      }, {});

      await collection.insertOne(dataObject);

      return { message: `Documents added to '${collectionName}'` };
    } catch (error) {
      console.error(`Error creating document:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateDocument(args: UpdateDocumentArgs) {
    const { collectionName, set, where } = args;

    try {
      const db = this.client.db();

      const collection = db.collection(collectionName);

      const updateObject = set.reduce((acc, obj) => {
        acc[obj.name] = obj.value;
        return acc;
      }, {});

      await collection.updateOne(
        { [where.name]: where.value },
        { $set: updateObject },
      );

      return { message: `Documents updated` };
    } catch (error) {
      console.error(`Error creating document:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteDocuments(args: DeleteDocumentArgs) {
    const { collectionName, deleteAll, where } = args;
    try {
      const db = this.client.db();

      const collection = db.collection(collectionName);

      if (deleteAll) {
        await collection.deleteMany(
          typeof deleteAll === 'boolean' ? {} : mongodbFilter(deleteAll),
        );
      } else {
        for (let i = 0; i < where.length; i++) {
          const data = where[i];

          await collection.deleteOne({ [data.name]: data.value });
        }
      }

      return {
        message: deleteAll ? 'All documents deleted' : `Documents updated`,
      };
    } catch (error) {
      console.error(`Error deleting document:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async changeCollectionName(args: ChangeCollectionNameArgs) {
    const { collectionName, newCollectionName } = args;
    try {
      const db = this.client.db();

      const results = await db
        .collection(collectionName)
        .rename(newCollectionName);

      if (results) return { message: 'Name changed successfully' };

      return { message: `Changing collection name ${collectionName} failed` };
    } catch (error) {
      console.error(
        `Error changing collection name '${collectionName}':`,
        error,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  public async duplicateCollection(
    args: DuplicateCollectionArgs,
  ): Promise<MongodbCollection> {
    const { collectionName, duplicateName, withData = true } = args;
    try {
      const db = this.client.db();

      const sourceCollection = db.collection(collectionName);
      const destinationCollection = await db.createCollection(duplicateName);

      // Copy documents from source to destination collection

      if (withData) {
        const sourceData = await sourceCollection.find({}).toArray();

        destinationCollection.insertMany(sourceData);
      }

      return destinationCollection;
    } catch (error) {
      console.error(
        `Error duplicating collection '${collectionName}' to '${duplicateName}':`,
        error,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteCollection(collectionName: string) {
    try {
      const db = this.client.db();

      const results = await db.dropCollection(collectionName);

      if (results) return { message: 'Collection deleted successfully' };

      return { message: `Deleting collection ${collectionName} failed` };
    } catch (error) {
      console.error(`Error deleting collection '${collectionName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.client.close();
    } catch (error) {
      console.error('Error closing connection to MongoDB:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
