import { v4 as uuidv4 } from 'uuid';
import { createFixture } from 'zod-fixture';
import { DbDocument, RawInput, RawInputSchema } from '../data/model-schema';

export function createTestInput(): RawInput {
  const { first, last } = createFixture(RawInputSchema);
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
  const fnVal = { input, result };
  return fnVal;
}
