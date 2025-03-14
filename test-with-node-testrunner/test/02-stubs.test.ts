import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';

class Service {
  static async getTalks({ skip, limit }) {
    // Use a public API (jsonplaceholder) to retrieve posts with pagination.
    const url = `https://jsonplaceholder.typicode.com/posts?_start=${skip}&_limit=${limit}`;
    const response = await fetch(url);
    return response.json();
  }
}

function mapResponse(data) {
  return data
    .map(({ id, title }, index) => `[${index}] id: ${id}, title: ${title}`)
    .join('\n');
}

async function run({ skip = 0, limit = 10 } = {}) {
  const talks = mapResponse(await Service.getTalks({ skip, limit }));
  return talks;
}

describe('Stub Test Suite', () => {
  beforeEach(() => mock.restoreAll());

  it('should stub APIs', async () => {
    // Stub Service.getTalks so that it returns one fake post.
    const m = mock.method(Service, 'getTalks').mock;
    m.mockImplementation(async () => [
      {
        id: '1',
        title: 'Sample Post'
      }
    ]);

    const result = await run({ limit: 1 });
    const expected = `[0] id: 1, title: Sample Post`;

    // Verify that the stubbed method was called once.
    assert.deepStrictEqual(m.callCount(), 1);
    const calls = m.calls;
    assert.deepStrictEqual(calls[0].arguments[0], { skip: 0, limit: 1 });
    assert.strictEqual(result, expected);
  });

  it('should stub different values for API calls', async () => {

    // Instead of chaining mockImplementationOnce, build a responses array.
    const m = mock.method(Service, 'getTalks').mock;
    const responses = [
      async () => [{ id: '1', title: 'Post One' }],
      async () => [{ id: '2', title: 'Post Two' }],
      async () => [{ id: '3', title: 'Post Three' }]
    ];

    m.mockImplementation(async (args) => {
      // Return the next response from the array.
      const fn = responses.shift();
      return fn ? fn() : [];
    });

    {
      const result = await run({ skip: 0, limit: 1 });
      const expected = `[0] id: 1, title: Post One`;
      assert.strictEqual(result, expected);
    }
    {
      const result = await run({ skip: 1, limit: 1 });
      const expected = `[0] id: 2, title: Post Two`;
      assert.strictEqual(result, expected);
    }
    {
      const result = await run({ skip: 2, limit: 1 });
      const expected = `[0] id: 3, title: Post Three`;
      assert.strictEqual(result, expected);
    }

    const calls = m.calls;
    assert.strictEqual(m.callCount(), 3);
    assert.deepStrictEqual(calls[0].arguments[0], { skip: 0, limit: 1 });
    assert.deepStrictEqual(calls[1].arguments[0], { skip: 1, limit: 1 });
    assert.deepStrictEqual(calls[2].arguments[0], { skip: 2, limit: 1 });
  });
});
