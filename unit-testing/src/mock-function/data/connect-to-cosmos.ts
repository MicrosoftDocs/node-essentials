// connect-to-cosmos.ts

import { Container, CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

export { Container };

export function connectToCosmosWithoutKey() {
  const endpoint = process.env.COSMOS_DB_ENDPOINT!;
  const credential = new DefaultAzureCredential();

  const client = new CosmosClient({ endpoint, aadCredentials: credential });
  return client;
}
export async function connectToContainer(): Promise<Container> {
  const client = connectToCosmosWithoutKey();
  const databaseName = process.env.COSMOS_DATABASE_NAME;
  const containerName = process.env.COSMOS_CONTAINER_NAME;

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
export function getUniqueId(): string {
  return uuidv4();
}
