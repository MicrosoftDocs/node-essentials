import CosmosConnector from './data/connect-to-cosmos.ts';
import { createTestInput } from './data/fake-data.ts';
import type { DbDocument, DbError, VerificationErrors } from './data/model.ts';
import { insertDocument } from './lib/insert.ts';

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
