// insertDocument.test.ts
import { Container } from '../data/connect-to-cosmos';
import { createTestInputAndResult } from '../data/fake-data';
import {
  DbDocument,
  DbError,
  isDbDocument,
  isDbError,
  isVerificationErrors,
  RawInput,
} from '../data/model-schema';
import { inputVerified } from '../data/verify';
import { insertDocument } from './insert';

// Mock the dependencies
jest.mock('../data/connect-to-cosmos', () => ({
  connectToContainer: jest.fn(),
  getUniqueId: jest.fn().mockReturnValue('unique-id'),
  Container: jest.fn(),
}));

jest.mock('../data/verify', () => ({
  inputVerified: jest.fn(),
}));

describe('insertDocument', () => {
  let mockContainer: jest.Mocked<Container>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    mockContainer = {
      items: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<Container>;
  });

  it('should return verification error if input is not verified', async () => {
    jest.mocked(inputVerified).mockReturnValue(false);

    // wrong shape of doc
    const doc = { name: 'test' };

    const insertDocumentResult = await insertDocument(
      mockContainer,
      doc as unknown as RawInput,
    );

    // State verification: Check the result when verification fails
    if (isVerificationErrors(returnedFunctionResult)) {
      expect(returnedFunctionResult).toEqual({
        message: 'Verification failed',
      });
    } else {
      throw new Error('Result is not of type VerificationErrors');
    }

    // Behavior verification: Ensure create method was not called
    expect(mockContainer.items.create).not.toHaveBeenCalled();
  });

  it('should insert document successfully', async () => {
    const { input, result }: { input: RawInput; result: Partial<DbDocument> } =
      createTestInputAndResult();

    (inputVerified as jest.Mock).mockReturnValue(true);
    (mockContainer.items.create as jest.Mock).mockResolvedValue({
      resource: result,
    });

    const returnedFunctionResult = await insertDocument(mockContainer, input);

    // State verification: Check the result when insertion is successful
    //if (isDbDocument(returnedFunctionResult)) {
      expect(returnedFunctionResult).toEqual(result);
    //} else {
    //  throw new Error('Result is not of type DbDocument');
    //}
    // Behavior verification: Ensure create method was called with correct arguments
    expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
  });

  it('should return error if db insert fails', async () => {
    const { input } = createTestInputAndResult();

    const mockError: DbError = {
      message: 'An unknown error occurred',
      code: 500,
    };

    (inputVerified as jest.Mock).mockReturnValue(true);
    (mockContainer.items.create as jest.Mock).mockRejectedValue(mockError);

    const result = await insertDocument(mockContainer, input);

    // Verify type as DbError
    if (isDbError(result)) {
      expect(result.message).toBe(mockError.message);
    } else {
      throw new Error('Result is not of type DbError');
    }

    // Behavior verification: Ensure create method was called with correct arguments
    expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
  });
});
