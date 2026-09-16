// insertDocument.ts
import { Container } from '../data/connect-to-cosmos.js';
import type {
  DbDocument,
  DbError,
  RawInput,
  VerificationErrors,
} from '../data/model.js';
import Verify from '../data/verify.js';

export async function insertDocument(
  container: Container,
  doc: RawInput,
): Promise<DbDocument | DbError | VerificationErrors> {
  const isVerified: boolean = Verify.inputVerified(doc);

  if (!isVerified) {
    return { message: 'Verification failed' };
  }

  try {
    const { resource } = await container.items.create({
      id: doc.id,
      name: `${doc.first} ${doc.last}`,
    });

    return resource as DbDocument;
  } catch (error: any) {
    if (error instanceof Error) {
      if ((error as any).code === 409) {
        return {
          message: 'Insertion failed: Duplicate entry',
          code: 409,
        };
      }
      return { message: error.message, code: (error as any).code };
    } else {
      return { message: 'An unknown error occurred', code: 500 };
    }
  }
}
