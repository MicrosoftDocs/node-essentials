import {
    describe,
    it,
    mock
} from 'node:test';
import assert from 'node:assert';


function run({fn, times}){
    for(let i = 0; i < times; i++){
        fn({current: i * 5});
    }
}

describe('Spies', () => {
    it('should verify calls in a mock', () => {
        const spy = mock.fn();
        run({fn: spy, times: 2});

        assert.strictEqual(spy.mock.callCount(), 3);

        expect(spy).toHaveBeenNthCalledWith(1, {current: 0});
        expect(spy).toHaveBeenNthCalledWith(2, {current: 5});
        expect(spy).toHaveBeenNthCalledWith(3, {current: 10});
    });
});