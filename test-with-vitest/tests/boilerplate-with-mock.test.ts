// boilerplate-with-mock.test.ts
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

const result = 1;

class MyService {
  static async myFunction() {
    return Promise.resolve(result);
  }
}

describe('boilerplate with mock', () => {
  beforeEach(() => {
    // Restore all mocks before each test.
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Cleanup required after each test (if needed).
  });

  it('should <do something> if <situation is present>', async () => {
    // Arrange: Replace the original implementation with a mock, returning 2.
    vi.spyOn(MyService, 'myFunction').mockResolvedValue(2);

    // Act: Test the function: it should now return the mocked value.
    const resultVal = await MyService.myFunction();

    // Assert
    expect(resultVal).toBe(2);
  });
});