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

  const maxPageSize = 3;
  // The iterator also supports iteration by page with a configurable (and optional) `maxPageSize` setting.
  for await (const response of blobServiceClient.listContainers().byPage({
    maxPageSize,
  })) {
    if (response.containerItems) {
      for (const container of response.containerItems) {
        console.log(`Container: ${container.name}`);
      }
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
