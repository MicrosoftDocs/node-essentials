import {
    describe,
    it,
    afterEach,
    beforeEach,
    mock
  } from 'node:test'
  import assert from 'node:assert'


// original value is 1
const result = 1;

class MyService {
    static async myFunction() {
        return Promise.resolve(result);
    }
}

describe('boilerplate with mock', () => {
    beforeEach(() =>{
        // Setup required before each test
        mock.restoreAll()
    })
    afterEach(() => {
        // Cleanup required after each test
      });
  
    it('should <do something> if <situation is present>', async () => {

        // Replace the original implementation with a mock, returning 2
        const m = mock.method(MyService, "myFunction").mock;
        m.mockImplementation(async () => Promise.resolve(2))


        // Test the function, but get the mocked value
        const result = await MyService.myFunction();
        assert.strictEqual(result,
            2
        )
    })
  })