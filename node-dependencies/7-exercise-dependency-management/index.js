const fetch = require('node-fetch')
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

async function run() {
  const response = await fetch("https://dev.to/api/articles?state=rising");
  const json = await response.json();
  const sorted = _.sortBy(json, ["public_reactions_count"], ['desc']);
  const top5 = _.take(sorted, 3);

  const filePrefix = new Date().toISOString().split('T')[0];
  fs.writeFileSync(path.join(__dirname, `${filePrefix}-feed.json`), JSON.stringify(top5, null, 2));
}

run();