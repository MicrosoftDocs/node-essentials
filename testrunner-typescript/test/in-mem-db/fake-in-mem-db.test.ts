// fake-in-mem-db.spec.ts
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

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
  let originalSave: (key: string, value: any) => void;
  let saveSpyCallCount: number;
  let saveSpyArgs: Array<[string, any]>;

  beforeEach(() => {
    fakeDb = new FakeDatabase();
    testKey = 'testKey';
    testValue = {
      first: 'John',
      last: 'Jones',
      lastUpdated: new Date().toISOString(),
    };

    // Create a simple spy on the save method
    originalSave = fakeDb.save.bind(fakeDb);
    saveSpyCallCount = 0;
    saveSpyArgs = [];
    fakeDb.save = function (key: string, value: any): void {
      saveSpyCallCount++;
      saveSpyArgs.push([key, value]);
      return originalSave(key, value);
    };
  });

  afterEach(() => {
    // Restore original method if necessary
    fakeDb.save = originalSave;
  });

  it('should save and return the correct value', () => {
    // Call the function under test
    const result = someTestFunction(fakeDb, testKey, testValue);

    // Verify state
    assert.deepStrictEqual(result, testValue);
    assert.strictEqual(result.first, 'John');
    assert.strictEqual(result.last, 'Jones');
    assert.strictEqual(result.lastUpdated, testValue.lastUpdated);

    // Verify behavior using our manual spy
    assert.strictEqual(saveSpyCallCount, 1);
    assert.deepStrictEqual(saveSpyArgs[0], [testKey, testValue]);
  });
});