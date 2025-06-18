import { BlobServiceClient } from '@azure/storage-blob';

export async function deleteContainers(
  blobServiceClient: BlobServiceClient
): Promise<void> {
  // delete all containers
  for await (const container of blobServiceClient.listContainers()) {
    const containerClient = blobServiceClient.getContainerClient(
      container.name
    );
    await containerClient.delete();
    console.log(`Deleted container: ${container.name}`);
  }
}
