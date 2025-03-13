"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_data_1 = require("../data/fake-data");
const model_1 = require("../data/model");
const verify_1 = require("../data/verify");
const insert_1 = require("./insert");
// Mock app dependencies for Cosmos DB setup
jest.mock('../data/connect-to-cosmos', () => ({
    connectToContainer: jest.fn(),
    getUniqueId: jest.fn().mockReturnValue('unique-id'),
}));
// Mock app dependencies for input verification
jest.mock('../data/verify', () => ({
    inputVerified: jest.fn(),
}));
describe('insertDocument', () => {
    // Mock the Cosmo DB Container object
    let mockContainer;
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        // Mock the Cosmos DB Container create method
        mockContainer = {
            items: {
                create: jest.fn(),
            },
        };
    });
    it('should return verification error if input is not verified', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange - Mock the input verification function to return false
        jest.mocked(verify_1.inputVerified).mockReturnValue(false);
        // Arrange - wrong shape of doc on purpose
        const doc = { name: 'test' };
        // Act - Call the function to test
        const insertDocumentResult = yield (0, insert_1.insertDocument)(mockContainer, doc);
        // Assert - State verification: Check the result when verification fails
        if ((0, model_1.isVerificationErrors)(insertDocumentResult)) {
            expect(insertDocumentResult).toEqual({
                message: 'Verification failed',
            });
        }
        else {
            throw new Error('Result is not of type VerificationErrors');
        }
        // Assert - Behavior verification: Ensure create method was not called
        expect(mockContainer.items.create).not.toHaveBeenCalled();
    }));
    it('should insert document successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange - create input and expected result data
        const { input, result } = (0, fake_data_1.createTestInputAndResult)();
        // Arrange - mock the input verification function to return true
        verify_1.inputVerified.mockReturnValue(true);
        mockContainer.items.create.mockResolvedValue({
            resource: result,
        });
        // Act - Call the function to test
        const insertDocumentResult = yield (0, insert_1.insertDocument)(mockContainer, input);
        // Assert - State verification: Check the result when insertion is successful
        expect(insertDocumentResult).toEqual(result);
        // Assert - Behavior verification: Ensure create method was called with correct arguments
        expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
        expect(mockContainer.items.create).toHaveBeenCalledWith({
            id: input.id,
            name: result.name,
        });
    }));
    it('should return error if db insert fails', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange - create input and expected result data
        const { input, result } = (0, fake_data_1.createTestInputAndResult)();
        // Arrange - mock the input verification function to return true
        jest.mocked(verify_1.inputVerified).mockReturnValue(true);
        // Arrange - mock the Cosmos DB create method to throw an error
        const mockError = {
            message: 'An unknown error occurred',
            code: 500,
        };
        jest.mocked(mockContainer.items.create).mockRejectedValue(mockError);
        // Act - Call the function to test
        const insertDocumentResult = yield (0, insert_1.insertDocument)(mockContainer, input);
        // Assert - verify type as DbError
        if ((0, model_1.isDbError)(insertDocumentResult)) {
            expect(insertDocumentResult.message).toBe(mockError.message);
        }
        else {
            throw new Error('Result is not of type DbError');
        }
        // Assert - Behavior verification: Ensure create method was called with correct arguments
        expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
        expect(mockContainer.items.create).toHaveBeenCalledWith({
            id: input.id,
            name: result.name,
        });
    }));
});
