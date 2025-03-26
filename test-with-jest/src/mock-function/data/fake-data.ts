import { DbDocument, RawInput } from './model';
import { randomUUID } from 'crypto';

// Predefined arrays of first and last names
const firstNames = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve', 'Frank'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'];

function getRandomElement<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function createFixture<T>(): T {
  const result = {
    first: getRandomElement(firstNames),
    last: getRandomElement(lastNames),
  };
  return result as T;
}

export function createTestInput(): RawInput {
  const { first, last } = createFixture<RawInput>();
  return { id: randomUUID(), first, last };
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
