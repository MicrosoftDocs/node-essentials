import { connectToContainer } from './data/connect-to-cosmos';
import { createTestInput } from './data/fake-data';
import { DbDocument, DbError, VerificationErrors } from './data/model';
import { insertDocument } from './lib/insert';

try {
  const container = await connectToContainer();
  const input = createTestInput();
  const result = await insertDocument(container, input);
  console.log(result);
} catch (error) {
  console.error(error);
  process.exit(1);
}