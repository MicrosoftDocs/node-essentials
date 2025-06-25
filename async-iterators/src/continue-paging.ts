import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { deleteContainers } from './delete-containers.js';
import { createContainers } from './create-containers.js';
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

  const itemCount = 20;

  const containers = await createContainers(blobServiceClient, itemCount);
  const containerClient = blobServiceClient.getContainerClient(containers[0]);

  return { blobServiceClient, containerClient };
}
// Return true if processing should stop (operation complete)
async function fakeProcessor(page): Promise<boolean> {
  // Simulate a long-running operation on a page of results.
  await new Promise(resolve => setTimeout(resolve, 1000));
  const shouldStop = Math.random() < 0.5;
  console.log(`Processed page with ${page.containerItems.length} containers.`);
  return shouldStop;
}

async function main(): Promise<void> {
  const { blobServiceClient } = await setup();

  // <Continue_paging>
  console.log('Starting to process pages...');

  let processingComplete = false;
  let pageNumber = 1;

  try {
    let page = undefined;
    let continuationToken = undefined;

    do {
      // Get a page of results
      page = await blobServiceClient.listContainers().byPage().next();

      // Get the continuation token from the current page
      continuationToken = page?.value?.continuationToken;

      console.log(
        `Processing page ${pageNumber}, items ${page.value.containerItems?.length || 0} with continuation token: ${continuationToken || 'none'}`
      );
      console.log(page.value);

      // Scenario to continue paging:
      // Perform an operation on the current page results
      // if the operation returns true, stop processing
      processingComplete = await fakeProcessor(page.value);
      if (processingComplete) {
        console.log('Stopping processing.');
        break;
      }
      console.log(
        `Processing complete for page ${pageNumber++}: get next page if a continuation token exists`
      );
    } while (continuationToken && !processingComplete);

    console.log(
      `Finished processing. Total pages processed: ${pageNumber - 1}`
    );
    // </Continue_paging>

    await deleteContainers(blobServiceClient);
  } catch (error) {
    console.error('Error during processing:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('done');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
