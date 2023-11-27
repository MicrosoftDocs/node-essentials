const { test, expect } = require('@playwright/test');
const { addressParser } = require('../address-parser');

test('Address Parser', () => {
    const result = addressParser(
        'order: 3 books to address: 112 street city here is my payment info: cardnumber'
    );

    expect(result).toEqual({
        order: '3 books',
        address: '112 street city',
        payment: 'cardnumber',
    });
});