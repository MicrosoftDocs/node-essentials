// input-verified.ts
import { z } from 'zod';

export interface DbDocument {
  id: string;
  name: string;
}

export interface DbError {
  message: string;
  code: number;
}
export function isDbError(error: any): error is DbError {
  return 'message' in error && 'code' in error;
}

export interface VerificationErrors {
  message: string;
}
export function isVerificationErrors(error: any): error is VerificationErrors {
  return 'message' in error;
}

export interface RawInput {
  id: string;
  first: string;
  last: string;
}

export function validateRawInput(input: any): string[] {
  const errors: string[] = [];

  if (typeof input.first !== 'string' || input.first.trim().length === 0) {
    errors.push('First name is required and must be a non-empty string');
  }

  if (typeof input.last !== 'string' || input.last.trim().length === 0) {
    errors.push('Last name is required and must be a non-empty string');
  }

  return errors;
}
