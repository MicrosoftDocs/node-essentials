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
// insertDocument.test.ts
const insert_1 = require("./insert");
const verify_1 = require("../data/verify");
const fake_data_1 = require("../data/fake-data");
const model_schema_1 = require("../data/model-schema");
// Mock the dependencies
jest.mock('../data/connect-to-cosmos', () => ({
    connectToContainer: jest.fn(),
    getUniqueId: jest.fn().mockReturnValue('unique-id'),
    Container: jest.fn()
}));
jest.mock('../data/verify', () => ({
    inputVerified: jest.fn()
}));
describe('insertDocument', () => {
    let mockContainer;
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        mockContainer = {
            items: {
                create: jest.fn()
            }
        };
    });
    it('should return verification error if input is not verified', () => __awaiter(void 0, void 0, void 0, function* () {
        verify_1.inputVerified.mockReturnValue(false);
        // wrong shape of doc
        const doc = { name: 'test' };
        const returnedFunctionResult = yield (0, insert_1.insertDocument)(mockContainer, doc);
        // State verification: Check the result when verification fails
        if ((0, model_schema_1.isVerificationErrors)(returnedFunctionResult)) {
            expect(returnedFunctionResult).toEqual({ message: 'Verification failed' });
        }
        else {
            throw new Error('Result is not of type VerificationErrors');
        }
        // Behavior verification: Ensure create method was not called
        expect(mockContainer.items.create).not.toHaveBeenCalled();
    }));
    it('should insert document successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { input, result } = (0, fake_data_1.createTestInputAndResult)();
        verify_1.inputVerified.mockReturnValue(true);
        mockContainer.items.create.mockResolvedValue({ resource: result });
        const returnedFunctionResult = yield (0, insert_1.insertDocument)(mockContainer, input);
        // State verification: Check the result when insertion is successful
        if ((0, model_schema_1.isDbDocument)(returnedFunctionResult)) {
            expect(returnedFunctionResult).toEqual(result);
        }
        else {
            throw new Error('Result is not of type DbDocument');
        }
        // Behavior verification: Ensure create method was called with correct arguments
        expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
    }));
    it('should return error if db insert fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const { input } = (0, fake_data_1.createTestInputAndResult)();
        const mockError = {
            message: 'An unknown error occurred',
            code: 500
        };
        verify_1.inputVerified.mockReturnValue(true);
        mockContainer.items.create.mockRejectedValue(mockError);
        const result = yield (0, insert_1.insertDocument)(mockContainer, input);
        // Verify type as DbError
        if ((0, model_schema_1.isDbError)(result)) {
            expect(result.message).toBe(mockError.message);
        }
        else {
            throw new Error('Result is not of type DbError');
        }
        // Behavior verification: Ensure create method was called with correct arguments
        expect(mockContainer.items.create).toHaveBeenCalledTimes(1);
    }));
});
