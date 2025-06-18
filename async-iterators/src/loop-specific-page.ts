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

async function main(): Promise<void> {
  const { blobServiceClient } = await setup();

  // <Loop_over_data_at_specific_page>
  // Navigate to the 5th page
  const targetPage = 5;
  let currentPage = 1;
  let continuationToken: string | undefined;

  console.log(`Navigating to page ${targetPage}...`);

  // Iterate through pages until we reach the target page
  const iterator = blobServiceClient.listContainers().byPage();

  while (currentPage < targetPage) {
    const pageResult = await iterator.next();

    if (pageResult.done) {
      console.log(
        `Only ${currentPage} pages available. Cannot reach page ${targetPage}.`
      );
      return;
    }

    continuationToken = pageResult.value.continuationToken;
    const containerCount = pageResult.value.containerItems?.length || 0;
    console.log(
      `Skipped page ${currentPage} with ${containerCount} containers`
    );
    currentPage++;

    // If no continuation token, we've reached the end
    if (!continuationToken && currentPage < targetPage) {
      console.log(
        `Only ${currentPage} pages available. Cannot reach page ${targetPage}.`
      );
      return;
    }
  }

  // Get the 5th page
  const fifthPageResult = await iterator.next();

  if (fifthPageResult.done) {
    console.log(`Page ${targetPage} not available.`);
  } else {
    const containerCount = fifthPageResult.value.containerItems?.length || 0;
    console.log(
      `\nPage ${targetPage} contents (${containerCount} containers):`
    );
    if (fifthPageResult.value.containerItems && containerCount > 0) {
      for (const container of fifthPageResult.value.containerItems) {
        console.log(`Container: ${container.name}`);
      }
    } else {
      console.log('No containers found on this page');
    }
  }
  // </Loop_over_data_at_specific_page>
  await deleteContainers(blobServiceClient);
}

main()
  .then(() => console.log('done'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
