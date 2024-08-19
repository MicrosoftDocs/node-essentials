// insertDocument.ts
import { Container } from '../data/connect-to-cosmos';
import {
    DbDocument,
    DbError,
    RawInput,
    VerificationErrors,
} from '../data/model-schema';
import { inputVerified } from '../data/verify';

export async function insertDocument(
  container: Container,
  doc: RawInput,
): Promise<DbDocument | DbError | VerificationErrors> {
  const isVerified: boolean = inputVerified(doc);

  if (!isVerified) {
    return { message: 'Verification failed' } as VerificationErrors;
  }

  try {
    const { resource } = await container.items.create({
      id: doc.id,
      name: `${doc.first} ${doc.last}`,
    });

    return resource as DbDocument;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ((error as any).code === 409) {
        return {
          message: 'Insertion failed: Duplicate entry',
          code: 409,
        } as DbError;
      }
      return { message: error.message, code: (error as any).code } as DbError;
    } else {
      return { message: 'An unknown error occurred', code: 500 } as DbError;
    }
  }
}
