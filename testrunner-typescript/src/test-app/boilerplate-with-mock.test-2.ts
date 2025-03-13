import {
    describe,
    it,
    afterEach,
    beforeEach,
    mock
  } from 'node:test'
import assert from 'node:assert';

import CosmosConnector from '../app/data/connect-to-cosmos';

describe('boilerplate with mock 2', () => {
    beforeEach(() =>{
        // Setup required before each test
        mock.restoreAll()
    })
    afterEach(() => {
        // Cleanup required after each test
      });
  
    it('should <do something> if <situation is present>', async () => {

        const m = mock.method(CosmosConnector, "getUniqueId");
        m.mock.mockImplementation(() => {
            // Replace the original implementation with a mock result
            
            // return fake guid
            return '12345678-1234-1234-1234-123456789012'

        });

        const result = await CosmosConnector.getUniqueId();
        assert.strictEqual(result,
            '12345678-1234-1234-1234-123456789012'
        )

    })
  })