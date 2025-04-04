// boilerplate-with-mock.spec.ts

// Mock the dependencies
jest.mock('../mock-function/data/connect-to-cosmos', () => ({
  myFunctionToMock: jest.fn(),
}));

describe('nameOfGroupOfTests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.resetAllMocks();

    // Other setup required before each test
  });

  it('should <do something> if <situation is present>', async () => {
    // Arrange
    // - set up the test data and the expected result
    // Act
    // - call the function to test
    // Assert
    // - check the state: result returned from function
    // - check the behavior: dependency function calls
  });
});
