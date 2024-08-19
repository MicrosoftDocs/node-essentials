// input-verified.ts
import { RawInputSchema } from './model-schema';

export function inputVerified(doc: any): boolean {
  const result = RawInputSchema.safeParse(doc);
  return result.success;
}
