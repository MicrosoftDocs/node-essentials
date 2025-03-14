import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

class Service {
  static async getTalks({ skip, limit }: { skip: number; limit: number }): Promise<any[]> {
    // Use a public API (jsonplaceholder) to retrieve posts with pagination.
    const url = `https://jsonplaceholder.typicode.com/posts?_start=${skip}&_limit=${limit}`;
    const response = await fetch(url);
    return response.json();
  }
}

function mapResponse(data: any[]): string {
  return data
    .map(({ id, title }, index) => `[${index}] id: ${id}, title: ${title}`)
    .join('\n');
}

async function run({ skip = 0, limit = 10 } = {}): Promise<string> {
  const talks = mapResponse(await Service.getTalks({ skip, limit }));
  return talks;
}

describe('Stub Test Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Optional cleanup if needed.
  });

  it('should stub APIs', async () => {
    // Stub Service.getTalks so that it returns one fake post.
    const m = vi.spyOn(Service, 'getTalks');
    m.mockImplementation(async () => [
      {
        id: '1',
        title: 'Sample Post'
      }
    ]);

    const result = await run({ limit: 1 });
    const expected = `[0] id: 1, title: Sample Post`;

    // Verify that the stubbed method was called once.
    expect(m).toHaveBeenCalledTimes(1);
    expect(m.mock.calls[0][0]).toEqual({ skip: 0, limit: 1 });
    expect(result).toBe(expected);
  });

  it('should stub different values for API calls', async () => {
    // Instead of chaining multiple mockImplementationOnce calls, build a responses array:
    const m = vi.spyOn(Service, 'getTalks');
    const responses = [
      async () => [{ id: '1', title: 'Post One' }],
      async () => [{ id: '2', title: 'Post Two' }],
      async () => [{ id: '3', title: 'Post Three' }]
    ];

    m.mockImplementation(async (args) => {
      // Return the next response from the array.
      const fn = responses.shift();
      return fn ? await fn() : [];
    });

    {
      const result = await run({ skip: 0, limit: 1 });
      const expected = `[0] id: 1, title: Post One`;
      expect(result).toBe(expected);
    }
    {
      const result = await run({ skip: 1, limit: 1 });
      const expected = `[0] id: 2, title: Post Two`;
      expect(result).toBe(expected);
    }
    {
      const result = await run({ skip: 2, limit: 1 });
      const expected = `[0] id: 3, title: Post Three`;
      expect(result).toBe(expected);
    }

    // Verify call count and arguments.
    expect(m).toHaveBeenCalledTimes(3);
    expect(m.mock.calls[0][0]).toEqual({ skip: 0, limit: 1 });
    expect(m.mock.calls[1][0]).toEqual({ skip: 1, limit: 1 });
    expect(m.mock.calls[2][0]).toEqual({ skip: 2, limit: 1 });
  });
});