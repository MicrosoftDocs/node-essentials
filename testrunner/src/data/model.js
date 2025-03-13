"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDbError = isDbError;
exports.isVerificationErrors = isVerificationErrors;
exports.validateRawInput = validateRawInput;
function isDbError(error) {
    return 'message' in error && 'code' in error;
}
function isVerificationErrors(error) {
    return 'message' in error;
}
function validateRawInput(input) {
    const errors = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (typeof input.first !== 'string' || input.first.trim().length === 0) {
        errors.push('First name is required and must be a non-empty string');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (typeof input.last !== 'string' || input.last.trim().length === 0) {
        errors.push('Last name is required and must be a non-empty string');
    }
    return errors;
}
