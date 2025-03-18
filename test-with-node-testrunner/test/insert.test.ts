// insertDocument.test.ts
import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';

import { Container } from '../src/data/connect-to-cosmos.js';
import { createTestInputAndResult } from '../src/data/fake-data.js';
import type {
  DbDocument,
  DbError,
  RawInput,
} from '../src/data/model.js';
import {
  isDbError,
  isVerificationErrors,
} from '../src/data/model.js';

import Verify from '../src/data/verify.js';
import CosmosConnector from '../src/data/connect-to-cosmos.js';
import { insertDocument } from '../src/lib/insert.js';


describe('SDK', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    mock.restoreAll()
  })

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
    mContainerCreate.mockImplementation(async (doc: any) => {
      const mockError: DbError = {
        message: errorMessage,
        code: 500,
      };
      throw mockError;
    });

    // Act:
    const insertDocumentResult = await insertDocument(fakeContainer, input);

    // // Assert - Ensure create method was called once with the correct arguments.
    assert.strictEqual(isDbError(insertDocumentResult), true);
    assert.strictEqual(mContainerCreate.callCount(), 1);
    assert.deepStrictEqual(mContainerCreate.calls[0].arguments[0], {
      id: input.id,
      name: result.name,
    });
  });
});