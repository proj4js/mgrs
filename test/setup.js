const { writeFileSync } = require('fs');
const fetch = require('node-fetch');

async function process() {
  // mgrsToGeo_WE.txt was originally created by running the tests
  // for GEOTRANS version 3.8 in the geodesy/geotrans docker image
  // and found at the following path
  // geotrans3.8/SpreadsheetTester/TestFiles/outputs/output/mgrsToGeo_WE.txt
  const url = 'https://s3.amazonaws.com/mgrs.io/mgrsToGeo_WE.txt';

  const text = await fetch(url).then(response => response.text());

  // eslint-disable-next-line no-unused-vars
  const [header, description, blank, ...rows] = text.split(/\r?\n/);

  const testCases = rows
    .filter(testCase => {
      return testCase.includes('Successful-Equivalent');
    })
    .map(row => {
      const cells = row.replace(/\t+/g, '\t').split('\t');
      return {
        latitude: cells[9].trim(),
        longitude: cells[10].trim(),
        mgrs: cells[5].trim()
      };
    });


  console.log('testCases', testCases);
  const csv = 'mgrs,longitude,latitude\n' + testCases.map(({ mgrs, latitude, longitude }) => `${mgrs}\t${longitude}\t${latitude}`).join('\n');
  writeFileSync('testing-data.csv', csv, 'utf8');

  console.log('wrote testing-data.csv');
}

process();