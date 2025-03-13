// insertDocument.test.ts
import assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { Container } from '../data/connect-to-cosmos.ts';
import { createTestInputAndResult } from '../data/fake-data.ts';
import type {
  DbDocument,
  DbError,
  RawInput
} from '../data/model.ts';
import {
  isDbError,
  isVerificationErrors
} from '../data/model.ts';
// Instead of jest.mock, import the whole module to override functions as needed.
import CosmosConnector from '../data/connect-to-cosmos.ts';
import Verify from '../data/verify.ts';
import { insertDocument } from './insert.ts';

// --- Test suite for insertDocument ---
describe('Insert into db', () => {

  // Set up a fresh container object before each test.
  beforeEach(() => {
    // Setup required before each test
    mock.restoreAll()
  })

  it("Success", () => {
    it('should insert document successfully', async () => {
      // Arrange: override inputVerified to return true.
      const { input, result }: { input: RawInput; result: Partial<DbDocument> } = createTestInputAndResult();

      const fakeContainer = {
        items: {
          create: async (doc: any) => {
            return { resource: result };
          },
        },
      } as unknown as Container;

      const mVerify = mock.method(Verify, "inputVerified").mock;
      mVerify.mockImplementation(() => true);

      const mContainerCreate = mock.method(fakeContainer.items as any, "create").mock;
      mContainerCreate.mockImplementation(async (doc: any) => {
        return { resource: result };
      });

      // Act:
      const receivedResult = await insertDocument(fakeContainer, input);

      // Assert - State verification: Ensure the result is as expected.
      assert.deepStrictEqual(receivedResult, result);

      // Assert - Behavior verification: Ensure create was called once with correct arguments.
      assert.strictEqual(mContainerCreate.callCount(), 1);
      assert.deepStrictEqual(mContainerCreate.calls[0].arguments[0], {
        id: input.id,
        name: result.name,
      });
    });
  });

  it("Failure", () => {
    it('should return verification error if input is not verified', async () => {

      const fakeContainer = {
        items: {
          create: async (_: any) => {
            throw new Error('Create method not implemented');
          },
        },
      } as unknown as Container;

      const mVerify = mock.method(Verify, "inputVerified").mock;
      mVerify.mockImplementation(() => false);

      const mGetUniqueId = mock.method(CosmosConnector, "getUniqueId").mock;
      mGetUniqueId.mockImplementation(() => 'unique-id');

      const mContainerCreate = mock.method(fakeContainer.items, "create").mock;

      // Arrange: wrong shape of document on purpose.
      const doc = { name: 'test' } as unknown as RawInput;

      // Act:
      const insertDocumentResult = await insertDocument(fakeContainer, doc);

      // Assert - State verification.
      if (isVerificationErrors(insertDocumentResult)) {
        assert.deepStrictEqual(insertDocumentResult, { message: 'Verification failed' });
      } else {
        throw new Error('Result is not of type VerificationErrors');
      }

      // Assert - Behavior verification: Verify that create was never called.
      assert.strictEqual(mContainerCreate.callCount(), 0);

    });
  });

  it('should return error if db insert fails', async () => {
    // Arrange: override inputVerified to return true.
    const { input, result } = createTestInputAndResult();
    let errorMessage: string = 'An unknown error occurred';

    const fakeContainer = {
      items: {
        create: async (doc: any): Promise<any> => {
          return Promise.resolve(null);
        },
      },
    } as unknown as Container;

    const mVerify = mock.method(Verify, "inputVerified").mock;
    mVerify.mockImplementation(() => true);

    const mContainerCreate = mock.method(fakeContainer.items, "create").mock;
    mContainerCreate.mockImplementation = async (doc: any) => {
      const mockError: DbError = {
        message: errorMessage,
        code: 500,
      };
      throw mockError;
    }

    // Act:
    const insertDocumentResult = await insertDocument(fakeContainer, input);

    // Assert - Verify type as DbError.
    if (isDbError(insertDocumentResult)) {
      assert.strictEqual(insertDocumentResult.message, errorMessage);
    } else {
      throw new Error('Result is not of type DbError');
    }

    // Assert - Ensure create method was called once with the correct arguments.
    assert.strictEqual(mContainerCreate.callCount(), 1);
    assert.deepStrictEqual(mContainerCreate.calls[0].arguments[0], {
      id: input.id,
      name: result.name,
    });
  });
});