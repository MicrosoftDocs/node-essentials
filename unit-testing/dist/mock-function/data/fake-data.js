"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestInput = createTestInput;
exports.createTestInputAndResult = createTestInputAndResult;
const zod_fixture_1 = require("zod-fixture");
const uuid_1 = require("uuid");
const model_schema_1 = require("../data/model-schema");
function createTestInput() {
    const { first, last } = (0, zod_fixture_1.createFixture)(model_schema_1.RawInputSchema);
    return { id: (0, uuid_1.v4)(), first, last };
}
function createTestInputAndResult() {
    const input = createTestInput();
    const result = {
        id: input.id,
        name: `${input.first} ${input.last}`
    };
    const fnVal = { input, result };
    return fnVal;
}
