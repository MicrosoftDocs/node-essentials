// connect-to-cosmos.ts

import { Container, CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import 'dotenv/config';
import { randomUUID } from 'crypto';

export { Container };

export default class CosmosConnector {
  static connectToCosmosWithoutKey(): CosmosClient {
    const endpoint = process.env.COSMOS_DB_ENDPOINT!;
    const credential = new DefaultAzureCredential();
    const client = new CosmosClient({ endpoint, aadCredentials: credential });
    return client;
  }

  static async connectToContainer(): Promise<Container> {
    const client = CosmosConnector.connectToCosmosWithoutKey();
    const databaseName = process.env.COSMOS_DATABASE_NAME!;
    const containerName = process.env.COSMOS_CONTAINER_NAME!;

    // Ensure the database exists
    const { database } = await client.databases.createIfNotExists({
      id: databaseName,
    });

    // Ensure the container exists
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
    });

    return container;
  }

  static getUniqueId(): string {
    return randomUUID();
  }
}
