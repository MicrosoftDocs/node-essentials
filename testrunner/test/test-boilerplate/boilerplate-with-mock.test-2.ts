import {
    describe,
    it,
    afterEach,
    beforeEach,
    mock
  } from 'node:test'
import assert from 'node:assert';

import * as MyService from '../../src/data/connect-to-cosmos'

describe('boilerplate with mock', () => {
    beforeEach(() =>{
        // Setup required before each test
        mock.restoreAll()
    })
    afterEach(() => {
        // Cleanup required after each test
      });
  
    it('should <do something> if <situation is present>', async () => {

        const m = mock.method(MyService, "getUniqueId");
        m.mock.mockImplementation(() => {
            // Replace the original implementation with a mock result
            
            // return fake guid
            return '12345678-1234-1234-1234-123456789012'

        });

        const result = await MyService.getUniqueId();
        assert.strictEqual(result,
            '12345678-1234-1234-1234-123456789012'
        )

    })
  })