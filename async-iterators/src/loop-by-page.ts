import { deleteContainers } from './delete-containers';
import { setup } from './setup-blob-storage';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

async function main(): Promise<void> {
  const blobServiceClient = setup();

  const containerMax = 10;
  const containerNames: string[] = [];

  for (let i = 0; i < containerMax; i++) {
    containerNames.push(`container-${uuidv4()}`);
  }

  for (const name of containerNames) {
    const containerClient = blobServiceClient.getContainerClient(name);
    await containerClient.create();
    console.log(`Created container: ${name}`);
  }

  // <Loop_over_data_by_page>
  const firstPage = await blobServiceClient
    .listContainers()
    .byPage()
    .next();

  const continuationToken = firstPage.value.continuationToken;

  // The iterator also supports iteration by page.
  for await (const page of blobServiceClient.listContainers().byPage({continuationToken})) {
    if (page.containerItems) {
      for (const container of page.containerItems) {
        console.log(`Container: ${container.name}`);
      }
    }
  }
  // </Loop_over_data_by_page>
  await deleteContainers(blobServiceClient);
}

main()
  .then(() => console.log('done'))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });