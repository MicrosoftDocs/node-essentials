"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputVerified = inputVerified;
// input-verified.ts
const model_schema_1 = require("./model-schema");
function inputVerified(doc) {
    const result = model_schema_1.RawInputSchema.safeParse(doc);
    return result.success;
}
