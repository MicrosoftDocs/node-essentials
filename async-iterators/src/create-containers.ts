import { BlobServiceClient } from '@azure/storage-blob';

/**
 * Creates a specified number of containers with random names
 * @param blobServiceClient - The BlobServiceClient instance
 * @param count - Number of containers to create (default: 5)
 * @param prefix - Prefix for the container name (default: 'container')
 * @returns Array of created container names
 */
export async function createContainers(
  blobServiceClient: BlobServiceClient,
  count = 30,
  prefix = 'container'
): Promise<string[]> {
  const containerNames: string[] = [];

  console.log(`Creating ${count} containers with prefix: ${prefix}...`);

  for (let i = 0; i < count; i++) {
    // Generate a random name for the container
    // Container names must be lowercase, 3-63 characters, start with letter/number
    // and can contain only letters, numbers, and dashes
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const containerName = `${prefix}-${randomSuffix}`;

    // Get a reference to the container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    try {
      // Create the container
      await containerClient.create();
      console.log(`Created container: ${containerName}`);
      containerNames.push(containerName);
    } catch (error) {
      console.error(`Error creating container ${containerName}:`, error);
      // Continue to next container despite error
    }
  }

  console.log(`Successfully created ${containerNames.length} containers`);
  return containerNames;
}
