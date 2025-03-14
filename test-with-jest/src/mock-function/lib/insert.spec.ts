// insertDocument.test.ts
import { Container } from '../data/connect-to-cosmos';
import { createTestInputAndResult } from '../data/fake-data';
import type {
  DbDocument,
  DbError,
  RawInput
} from '../data/model';
import {
  isDbError,
  isVerificationErrors,
} from '../data/model';
import { inputVerified } from '../data/verify';
import { insertDocument } from './insert';

// Mock app dependencies for Cosmos DB setup
jest.mock('../data/connect-to-cosmos', () => ({
  connectToContainer: jest.fn(),
  getUniqueId: jest.fn().mockReturnValue('unique-id'),
}));

// Mock app dependencies for input verification
jest.mock('../data/verify', () => ({
  inputVerified: jest.fn(),
}));

describe('SDK', () => {
  // Mock the Cosmo DB Container object
  let mockContainer: jest.Mocked<Container>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock the Cosmos DB Container create method
    mockContainer = {
      items: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<Container>;
  });

  it('should return verification error if input is not verified', async () => {
    // Arrange - Mock the input verification function to return false
    jest.mocked(inputVerified).mockReturnValue(false);

    // Arrange - wrong shape of doc on purpose
    const doc = { name: 'test' };

    // Act - Call the function to test
    const insertDocumentResult = await insertDocument(
      mockContainer,
      doc as unknown as RawInput,
    );

    // Assert - State verification: Check the result when verification fails
    if (isVerificationErrors(insertDocumentResult)) {
      expect(insertDocumentResult).toEqual({
        message: 'Verification failed',
      });
    } else {
      throw new Error('Result is not of type VerificationErrors');
    }

    // Assert - Behavior verification: Ensure create method was not called
    expect(mockContainer.items.create).not.toHaveBeenCalled();
  });

  it('should insert document successfully', async () => {
    // Arrange - create input and expected result data
    const { input, result }: { input: RawInput; result: Partial<DbDocument> } =
      createTestInputAndResult();

    // Arrange - mock the input verification function to return true
    (inputVerified as jest.Mock).mockReturnValue(true);
    (mockContainer.items.create as jest.Mock).mockResolvedValue({
      resource: result,
    });

    // Act - Call the function to test
    const insertDocumentResult = await insertDocument(mockContainer, input);

    // Assert - State verification: Check the result when insertion is successful
    expect(insertDocumentResult).toEqual(result);

    // Assert - Behavior verification: Ensure create method was called with correct arguments
    expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
    expect(mockContainer.items.create).toHaveBeenCalledWith({
      id: input.id,
      name: result.name,
    });
  });

  it('should return error if db insert fails', async () => {
    // Arrange - create input and expected result data
    const { input, result } = createTestInputAndResult();

    // Arrange - mock the input verification function to return true
    jest.mocked(inputVerified).mockReturnValue(true);

    // Arrange - mock the Cosmos DB create method to throw an error
    const mockError: DbError = {
      message: 'An unknown error occurred',
      code: 500,
    };
    jest.mocked(mockContainer.items.create).mockRejectedValue(mockError);

    // Act - Call the function to test
    const insertDocumentResult = await insertDocument(mockContainer, input);

    // Assert - verify type as DbError
    if (isDbError(insertDocumentResult)) {
      expect(insertDocumentResult.message).toBe(mockError.message);
    } else {
      throw new Error('Result is not of type DbError');
    }

    // Assert - Behavior verification: Ensure create method was called with correct arguments
    expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
    expect(mockContainer.items.create).toHaveBeenCalledWith({
      id: input.id,
      name: result.name,
    });
  });
});
