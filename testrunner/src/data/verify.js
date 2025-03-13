"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputVerified = inputVerified;
// input-verified.ts
const model_1 = require("./model");
function inputVerified(doc) {
    const result = (0, model_1.validateRawInput)(doc);
    return result.length === 0 ? true : false;
}
