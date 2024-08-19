import { connectToContainer } from './data/connect-to-cosmos';
import { createTestInput } from './data/fake-data';
import { DbDocument, DbError, VerificationErrors } from './data/model-schema';
import { insertDocument } from './lib/insert';

async function main(): Promise<DbDocument | DbError | VerificationErrors> {
  const container = await connectToContainer();
  const input = createTestInput();
  return await insertDocument(container, input);
}

main()
  .then((doc) => console.log(doc))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
