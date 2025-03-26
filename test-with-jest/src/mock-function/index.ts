import { connectToContainer } from './data/connect-to-cosmos';
import { createTestInput } from './data/fake-data';
import { insertDocument } from './lib/insert';
import { DbDocument, DbError, VerificationErrors } from './data/model';

async function main(): Promise<DbDocument | DbError | VerificationErrors> {
  try {
    const container = await connectToContainer();
    const input = createTestInput();
    return insertDocument(container, input);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main()
  .then((result: any) => console.log(result))
  .catch(console.error);
