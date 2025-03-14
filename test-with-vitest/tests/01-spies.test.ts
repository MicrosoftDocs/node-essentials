import { describe, it, expect, vi } from 'vitest';

function run({ fn, times }: { fn: (arg: { current: number }) => void; times: number }) {
  for (let i = 0; i < times; i++) {
    fn({ current: i * 5 });
  }
}


  it('Spies: should verify calls in a mock', () => {
    const spy = vi.fn();
    run({ fn: spy, times: 3 });
    
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls[0][0]).toEqual({ current: 0 });
    expect(spy.mock.calls[1][0]).toEqual({ current: 5 });
    expect(spy.mock.calls[2][0]).toEqual({ current: 10 });
  });
