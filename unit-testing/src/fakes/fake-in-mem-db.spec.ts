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

// Jest test suite
describe('someTestFunction', () => {
  let fakeDb;
  let testKey;
  let testValue;

  beforeEach(() => {
    fakeDb = new FakeDatabase();
    testKey = 'testKey';
    testValue = {
      first: 'John',
      last: 'Jones',
      lastUpdated: new Date().toISOString(),
    };

    // Spy on the save method
    jest.spyOn(fakeDb, 'save');
  });

  afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  test('should save and return the correct value', () => {
    // Perform test
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
