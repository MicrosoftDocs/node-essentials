// input-verified.ts
import { validateRawInput } from './model-schema';

export function inputVerified(doc: any): boolean {
  const result = validateRawInput(doc);
  return (result.length===0) ? true : false;
}
