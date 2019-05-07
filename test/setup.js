const { writeFileSync } = require('fs');
const fetch = require('node-fetch');

async function process() {
  // originally downloaded from
  // http://earth-info.nga.mil/GandG/update/index.php?action=home
  // and found in the unpacked downloaded GEOTRANS folder at
  // geotrans3.7/SpreadsheetTester/TestFiles/outputs/output/mgrsToGeo_WE.txt
  const url = 'https://s3.amazonaws.com/mgrs.io/mgrsToGeo_WE.txt';

  let text = await fetch(url).then(response => response.text());

  const [header, description, blank, ...rows] = text.split('\r\n');

  let testCases = rows
  .filter(testCase => {
    return testCase.includes('Successful-Equivalent');
  })
  .map(row => {
    const cells = row.replace(/\t+/g, '\t').split('\t');
    return {
      latitude: cells[6].trim(),
      longitude: cells[7].trim(),
      mgrs: cells[5].trim()
    };
  })


  console.log("testCases", testCases);
  const csv = testCases.map(({mgrs, latitude, longitude}) => `${mgrs}\t${latitude}\t${longitude}`).join('\n');
  writeFileSync('testing-data.csv', csv, 'utf8');

  console.log("wrote testing-data.csv");
}

process();