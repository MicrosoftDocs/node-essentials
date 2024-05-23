import fetch from 'node-fetch';

console.log(`start`);
try {
  const res = await fetch('https://github.com/MicrosoftDocs/node-essentials');

  console.log('statusCode:', res.status);
} catch (error) {
  console.log(`error: ${error}`);
}
console.log(`end`);
