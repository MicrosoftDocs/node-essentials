// fake-in-mem-db.spec.ts
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

describe('someTestFunction', () => {
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
    // Clear all mocks
    jest.clearAllMocks();
  });

  test('should save and return the correct value', () => {
    // Spy on the save method
    jest.spyOn(fakeDb, 'save');

    // Call the function under test.
    const result = someTestFunction(fakeDb, testKey, testValue);

    // Verify state
    expect(result).toEqual(testValue);
    expect(result.first).toBe('John');
    expect(result.last).toBe('Jones');
    expect(result.lastUpdated).toBe(testValue.lastUpdated);

    // Verify behavior
    expect(fakeDb.save).toHaveBeenCalledWith(testKey, testValue);
  });
});
