import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { DbDocument, RawInput } from '../data/model-schema';

function createFixture<T>(): T {
  const result = {
    first: faker.name.firstName(),
    last: faker.name.lastName(),
  };
  return result as T;
}

export function createTestInput(): RawInput {
  const { first, last } = createFixture<RawInput>();
  return { id: uuidv4(), first, last };
}

export function createTestInputAndResult(): {
  input: RawInput;
  result: Partial<DbDocument>;
} {
  const input = createTestInput();
  const result = {
    id: input.id,
    name: `${input.first} ${input.last}`,
  };
  return { input, result };
}
