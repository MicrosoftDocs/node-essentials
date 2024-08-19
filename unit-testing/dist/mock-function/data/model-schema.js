"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawInputSchema = void 0;
exports.isDbDocument = isDbDocument;
exports.isDbError = isDbError;
exports.isVerificationErrors = isVerificationErrors;
// input-verified.ts
const zod_1 = require("zod");
function isDbDocument(doc) {
    return typeof doc === 'object' &&
        doc !== null &&
        'id' in doc && typeof doc.id === 'string' &&
        'name' in doc && typeof doc.name === 'string';
}
function isDbError(error) {
    return 'message' in error && 'code' in error;
}
function isVerificationErrors(error) {
    return 'message' in error;
}
exports.RawInputSchema = zod_1.z.object({
    first: zod_1.z.string().min(1, "First name is required"),
    last: zod_1.z.string().min(1, "Last name is required"),
});
