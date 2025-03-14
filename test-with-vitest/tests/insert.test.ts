import { describe, it, beforeEach, expect, vi } from 'vitest';
import type { Container, ItemResponse } from '@azure/cosmos';
import { insertDocument } from '../src/lib/insert.js';
import { createTestInputAndResult } from '../src/data/fake-data.js';
import type {
  DbDocument,
  DbError,
  RawInput
} from '../src/data/model.js';
import {
  isDbError,
  isVerificationErrors,
} from '../src/data/model.js';
import Verify from '../src/data/verify.js';


describe('insertDocument', () => {
  let fakeContainer: Container;

  beforeEach(() => {
    vi.restoreAllMocks();
    // Create a fake container with a mocked `create` function
    fakeContainer = {
      items: {
        create: vi.fn(),
      },
    } as unknown as Container;
  });

  it('should insert document successfully and validate the create call', async () => {
    // Prepare test data
    const { input, result }: { input: RawInput; result: Partial<DbDocument> } =
      createTestInputAndResult();
    const inputVerifiedMock = vi.spyOn(Verify, 'inputVerified');
    inputVerifiedMock.mockReturnValue(true);

    // Set up the mocked return value.
    // Here we "cast" our minimal object to satisfy the expected type ItemResponse<DbDocument>.
    (fakeContainer.items.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      resource: result,
      // Minimal additional properties required by ItemResponse.
      item: result,
      headers: {},
      statusCode: 201,
      diagnostics: {} as any,
      requestCharge: 0,
      activityId: 'fake-activity-id',
    } as unknown as ItemResponse<DbDocument>);

    // Call the function under test that internally calls container.items.create.
    const insertDocumentResult = await insertDocument(fakeContainer, input);

    // Validate the returned value.
    expect(insertDocumentResult).toEqual(result);

    // Validate that create was called once with the proper arguments.
    expect(inputVerifiedMock).toHaveBeenCalledTimes(1);
    expect(fakeContainer.items.create).toHaveBeenCalledTimes(1);
    expect(
      (fakeContainer.items.create as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0]
    ).toEqual({
      id: input.id,
      name: result.name,
    });
  });
  
  it('should return verification error if input is not verified', async () => {
    // Arrange – mock the input verification function to return false.
    const inputVerifiedMock = vi.spyOn(Verify, 'inputVerified');
    inputVerifiedMock.mockReturnValue(false);

    const doc = { name: 'test' };

    // Act – call the function under test.
    const insertDocumentResult = await insertDocument(
      fakeContainer,
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
    expect(fakeContainer.items.create).not.toHaveBeenCalled();
    expect(inputVerifiedMock).toHaveBeenCalledTimes(1);
  });
});