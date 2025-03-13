"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestInput = createTestInput;
exports.createTestInputAndResult = createTestInputAndResult;
const uuid_1 = require("uuid");
const faker_1 = require("@faker-js/faker");
function createFixture() {
    const result = {
        first: faker_1.faker.person.firstName(),
        last: faker_1.faker.person.lastName(),
    };
    return result;
}
function createTestInput() {
    const { first, last } = createFixture();
    return { id: (0, uuid_1.v4)(), first, last };
}
function createTestInputAndResult() {
    const input = createTestInput();
    const result = {
        id: input.id,
        name: `${input.first} ${input.last}`,
    };
    return { input, result };
}
