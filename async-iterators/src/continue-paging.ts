import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { deleteContainers } from './delete-containers.js';
import { createContainers } from './create-containers.js';
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
    new DefaultAzureCredential()
  );

  const containers = await createContainers(blobServiceClient, 600);
  const containerClient = blobServiceClient.getContainerClient(containers[0]);

  const blobMax = 10;

  for (let i = 0; i < blobMax; i++) {
    const blockBlobClient = containerClient.getBlockBlobClient(
      `blob-${uuidv4()}`
    );
    await blockBlobClient.upload('Hello world', 11);
    console.log(`Uploaded block blob: ${blockBlobClient.name}`);
  }

  return { blobServiceClient, containerClient };
}

// return false if the operation should continue to the next page
async function fakeProcessor(): Promise<boolean> {
  // Simulate a long-running operation on a page of results.
  return new Promise(resolve =>
    setTimeout(() => resolve(Math.random() < 0.5), 1000)
  );
}

async function main(): Promise<void> {
  const { blobServiceClient } = await setup();

  // <Continue_paging>
  let continuationToken: string | undefined = 'continue'; // Initialize with a value to start paging
  let processingComplete = false;

  while (continuationToken && !processingComplete) {
    const page = await blobServiceClient
      .listContainers()
      .byPage({ continuationToken })
      .next();
    continuationToken = page.value.continuationToken;

    // Scenario to continue paging:
    // Perform an operation on the current page results
    // if the operation returns false, continue to the next page
    processingComplete = await fakeProcessor();
  }

  // </Continue_paging>
  await deleteContainers(blobServiceClient);
}

main()
  .then(() => console.log('done'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
