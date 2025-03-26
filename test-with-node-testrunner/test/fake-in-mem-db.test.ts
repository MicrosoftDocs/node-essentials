// fake-in-mem-db.spec.ts
import { describe, it, beforeEach, afterEach, mock } from 'node:test';
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

  beforeEach(() => {
    fakeDb = new FakeDatabase();
    testKey = 'testKey';
    testValue = {
      first: 'John',
      last: 'Jones',
      lastUpdated: new Date().toISOString(),
    };
  });

  afterEach(() => {
    // Restore all mocks created by node:test’s mock helper.
    mock.restoreAll();
  });

  it('should save and return the correct value', () => {
    // Create a spy on the save method using node:test's mock helper.
    const saveSpy = mock.method(fakeDb, 'save').mock;

    // Call the function under test.
    const result = someTestFunction(fakeDb, testKey, testValue);

    // Verify state.
    assert.deepStrictEqual(result, testValue);
    assert.strictEqual(result.first, 'John');
    assert.strictEqual(result.last, 'Jones');
    assert.strictEqual(result.lastUpdated, testValue.lastUpdated);

    // Verify behavior
    assert.strictEqual(saveSpy.callCount(), 1);
    const calls = saveSpy.calls;
    assert.deepStrictEqual(calls[0].arguments, [testKey, testValue]);
  });
});
