// input-verified.ts
import { validateRawInput } from './model';

export function inputVerified(doc: any): boolean {
  const result = validateRawInput(doc);
  return result.length === 0;
}
