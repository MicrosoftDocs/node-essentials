import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { deleteContainers } from './delete-containers';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

async function setup(): Promise<{
  blobServiceClient: BlobServiceClient;
  containerClient: ContainerClient;
}> {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  if (!accountName) throw Error('Azure Storage accountName not found');

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential(),
  );

  const containerName = `container-${uuidv4()}`;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.create();
  console.log(`Created container: ${containerClient.containerName}`);

  const blobMax = 10;

  for (let i = 0; i < blobMax; i++) {
    const blockBlobClient = containerClient.getBlockBlobClient(
      `blob-${uuidv4()}`,
    );
    await blockBlobClient.upload('Hello world', 11);
    console.log(`Uploaded block blob: ${blockBlobClient.name}`);
  }

  return { blobServiceClient, containerClient };
}

async function main(): Promise<void> {
  const { blobServiceClient, containerClient } = await setup();

  const maxPageSize = 3;

  // Create iterator
  const iter = containerClient.listBlobsFlat().byPage({ maxPageSize });
  let pageNumber = 1;

  const result = await iter.next();
  if (result.done) {
    throw new Error('Expected at least one page of results.');
  }

  const continuationToken = result.value.continuationToken;
  if (!continuationToken) {
    throw new Error(
      'Expected a continuation token from the blob service, but one was not returned.',
    );
  }

  // Continue with iterator
  const resumed = containerClient
    .listBlobsFlat()
    .byPage({ continuationToken, maxPageSize });
  pageNumber = 2;
  for await (const page of resumed) {
    console.log(`- Page ${pageNumber++}:`);
    for (const blob of page.segment.blobItems) {
      console.log(`  - ${blob.name}`);
    }
  }

  await deleteContainers(blobServiceClient);
}

main()
  .then(() => console.log('done'))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
