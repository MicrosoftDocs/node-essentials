import https from 'https';
    
console.log(`start`);

try{
    const res = await https.get('https://nodejs.org/dist/index.json');

    console.log(res.statusCode);
} catch( error ){
    console.log(error);
}

console.log(`end`);