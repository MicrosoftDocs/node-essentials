import { describe, it, beforeEach, expect, vi, Mock } from 'vitest';
import { Container } from '../src/data/connect-to-cosmos.js';
import { createTestInputAndResult } from '../src/data/fake-data.js';
import {
  DbDocument,
  DbError,
  isDbError,
  isVerificationErrors,
  RawInput,
} from '../src/data/model.js';
import Verify from '../src/data/verify.js';
import { insertDocument } from '../src/lib/insert.js';

// Mock app dependencies for Cosmos DB setup
vi.mock('../app/data/connect-to-cosmos', () => ({
  connectToContainer: vi.fn(),
  getUniqueId: vi.fn().mockReturnValue('unique-id'),
}));

// Mock app dependencies for input verification
vi.mock('../app/data/verify', () => {
  return {
    default: class {
      static inputVerified = vi.fn();
    },
  };
});

describe('SDK', () => {
  // Declare the Cosmos DB Container mock.
  let mockContainer: Container;

  beforeEach(() => {
    // Clear all mocks before each test.
    vi.clearAllMocks();

    // Create a fake container with a mocked create method.
    mockContainer = {
      items: {
        create: vi.fn(),
      },
    } as unknown as Container;
  });

  it('should return verification error if input is not verified', async () => {
    // Arrange – mock the input verification function to return false.
    vi.spyOn(Verify, "inputVerified").mockReturnValue(false);
    // Arrange – provide a doc with an incorrect shape.
    const doc = { name: 'test' };

    // Act – call the function under test.
    const insertDocumentResult = await insertDocument(
      mockContainer,
      doc as unknown as RawInput,
    );

    // Assert – state verification: result should indicate verification failure.
    if (isVerificationErrors(insertDocumentResult)) {
      expect(insertDocumentResult).toEqual({
        message: 'Verification failed',
      });
    } else {
      throw new Error('Result is not of type VerificationErrors');
    }

    // Assert – behavior verification: ensure create method was not called.
    expect((mockContainer.items.create as vi.Mock)).not.toHaveBeenCalled();
  });

  it('should insert document successfully', async () => {
    // Arrange – create input and expected result data.
    const { input, result }: { input: RawInput; result: Partial<DbDocument> } =
      createTestInputAndResult();

    // Arrange – mock the input verification function to return true.
    vi.spyOn(Verify, "inputVerified").mockReturnValue(true);

    // Arrange – mock the create method to resolve with our expected result.
    const mockedCreate = mockContainer.items.create as unknown as Mock;
    mockedCreate.mockImplementation(async () => ({ resource: result }));

    // Act – call the function under test.
    const insertDocumentResult = await insertDocument(mockContainer, input);

    // Assert – state verification: check the result is as expected.
    expect(insertDocumentResult).toEqual(result);

    // Assert – behavior verification: ensure create was called once with correct arguments.
    expect(mockedCreate).toHaveBeenCalledTimes(1);
    expect(mockedCreate.mock.calls[0][0]).toEqual({
      id: input.id,
      name: result.name,
    });
  });

  it('should return error if db insert fails', async () => {
    // Arrange – create input and expected result data.
    const { input, result } = createTestInputAndResult();

    // Arrange – mock the input verification to return true.
    vi.spyOn(Verify, "inputVerified").mockReturnValue(true);

    // Arrange – mock the create method to reject with an error.
    const mockError: DbError = {
      message: 'An unknown error occurred',
      code: 500,
    };
    (mockContainer.items.create as vi.Mock).mockRejectedValue(mockError);

    // Act – call the function under test.
    const insertDocumentResult = await insertDocument(mockContainer, input);

    // Assert – verify result is of type DbError.
    if (isDbError(insertDocumentResult)) {
      expect(insertDocumentResult.message).toBe(mockError.message);
    } else {
      throw new Error('Result is not of type DbError');
    }

    // Assert – behavior verification: ensure create was called once with correct arguments.
    expect((mockContainer.items.create as vi.Mock)).toHaveBeenCalledTimes(1);
    expect((mockContainer.items.create as vi.Mock).mock.calls[0][0]).toEqual({
      id: input.id,
      name: result.name,
    });
  });
});