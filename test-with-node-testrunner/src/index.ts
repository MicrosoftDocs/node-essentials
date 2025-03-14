import CosmosConnector from './data/connect-to-cosmos.js';
import { createTestInput } from './data/fake-data.js';
import type { DbDocument, DbError, VerificationErrors } from './data/model.js';
import { insertDocument } from './lib/insert.js';

async function main(): Promise<DbDocument | DbError | VerificationErrors> {
  const container = await CosmosConnector.connectToContainer();
  const input = createTestInput();
  return await insertDocument(container, input);
}

main()
  .then((doc) => console.log(doc))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
