import { v4 as uuidv4 } from 'uuid';
import { deleteContainers } from './delete-containers';
import { setup } from './setup-blob-storage';
import 'dotenv/config';

async function main(): Promise<void> {
  const blobServiceClient = setup();

  const containerMax = 10;

  for (let i = 0; i < containerMax; i++) {
    const containerClient = blobServiceClient.getContainerClient(
      `container-${uuidv4()}`
    );
    await containerClient.create();
    console.log(`Created container: ${containerClient.containerName}`);
  }

  for await (const container of blobServiceClient.listContainers()) {
    console.log(`Container: ${container.name}`);
  }

  await deleteContainers(blobServiceClient);
}

main()
  .then(() => console.log('done'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
