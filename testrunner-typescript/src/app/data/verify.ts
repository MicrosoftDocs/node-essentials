// input-verified.ts
import { validateRawInput } from './model.ts';

export default class Verfiy {
  static inputVerified(doc: any): boolean {
    const result = validateRawInput(doc);
    return result.length === 0;
  }
}
