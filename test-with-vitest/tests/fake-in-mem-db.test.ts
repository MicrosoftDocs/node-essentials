import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

class FakeDatabase {
  private data: Record<string, any>;

  constructor() {
    this.data = {};
  }

  save(key: string, value: any): void {
    this.data[key] = value;
  }

  get(key: string): any {
    return this.data[key];
  }
}

// Function to test
function someTestFunction(db: FakeDatabase, key: string, value: any): any {
  db.save(key, value);
  return db.get(key);
}

describe('In-Mem DB', () => {
  let fakeDb: FakeDatabase;
  let testKey: string;
  let testValue: any;
  let saveSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fakeDb = new FakeDatabase();
    testKey = 'testKey';
    testValue = {
      first: 'John',
      last: 'Jones',
      lastUpdated: new Date().toISOString(),
    };

    // Create a spy on the save method.
    saveSpy = vi.spyOn(fakeDb, 'save');
  });

  afterEach(() => {
    // Restore the spied methods.
    vi.restoreAllMocks();
  });

  it('should save and return the correct value', () => {
    // Call the function under test.
    const result = someTestFunction(fakeDb, testKey, testValue);

    // Verify state.
    expect(result).toEqual(testValue);
    expect(result.first).toBe('John');
    expect(result.last).toBe('Jones');
    expect(result.lastUpdated).toBe(testValue.lastUpdated);

    // Verify behavior using vi.spyOn.
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(testKey, testValue);
  });
});