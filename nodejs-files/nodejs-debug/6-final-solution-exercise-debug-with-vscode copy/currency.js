const rates = {};

function setExchangeRate(rate, sourceCurrency, targetCurrency) {
  if (rates[sourceCurrency] === undefined) {
    rates[sourceCurrency] = {};
  }

  if (rates[targetCurrency] === undefined) {
    rates[targetCurrency] = {};
  }

  for (const currency in rates) {
    if (currency !== targetCurrency) {
      // Use a pivot rate for currencies that don't have the direct conversion rate
      const pivotRate = currency === sourceCurrency ? 1 : rates[currency][sourceCurrency];
      rates[currency][targetCurrency] = rate * pivotRate;
      rates[targetCurrency][currency] = 1 / (rate * pivotRate);
    }
  }
}

function convertToCurrency(value, sourceCurrency, targetCurrency) {
  const exchangeRate = rates[sourceCurrency][targetCurrency];
  return exchangeRate && value * exchangeRate;
}

function formatValueForDisplay(value) {
  return value.toFixed(2);
}

function printForeignValues(value, sourceCurrency) {
  console.info(`The value of ${value} ${sourceCurrency} is:`);

  for (const targetCurrency in rates) {
    if (targetCurrency !== sourceCurrency) {
      const convertedValue = convertToCurrency(value, sourceCurrency, targetCurrency);
      const displayValue = formatValueForDisplay(convertedValue);
      console.info(`- ${displayValue} ${targetCurrency}`);
    }
  }
}

setExchangeRate(0.88, 'USD', 'EUR');
setExchangeRate(107.4, 'USD', 'JPY');
printForeignValues(10, 'EUR');
