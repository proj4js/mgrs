const should = require('chai').should(); // eslint-disable-line no-unused-vars
const mgrs = require('../');
const { readFileSync } = require('fs');

describe('First MGRS set', () => {
  const mgrsStr = '33UXP04';
  const point = mgrs.MGRStoLL(mgrsStr);
  it('Longitude of point from MGRS correct.', () => {
    point[0].should.be.closeTo(16.41450, 0.000001);
  });
  it('Latitude of point from MGRS correct.', () => {
    point[1].should.be.closeTo(48.24949, 0.000001);
  });
  it('MGRS reference with highest accuracy correct.', () => {
    mgrs.LLtoMGRS(point).should.equal('33UXP0500444997');
  });
  it('MGRS reference with 1-digit accuracy correct.', () => {
    mgrs.LLtoMGRS(point,1).should.equal(mgrsStr);
  });
  it('MGRS reference with 0-digit accuracy correct.', () => {
    mgrs.LLtoMGRS(point, 0).should.equal('33UXP');
  });
});
describe('Second MGRS set', () => {
  const mgrsStr = '24XWT783908'; // near UTM zone border, so there are two ways to reference this
  const point = mgrs.MGRStoLL(mgrsStr);
  it('Longitude of point from MGRS correct.', () => {
    point[0].should.be.closeTo(-32.66433, 0.00001);
  });
  it('Latitude of point from MGRS correct.', () => {
    point[1].should.be.closeTo(83.62778, 0.00001);
  });
  it('MGRS reference with 3-digit accuracy correct.', () => {
    mgrs.LLtoMGRS(point,3).should.equal('25XEN041865');
  });
  it('MGRS reference with 5-digit accuracy, northing all zeros', () => {
    mgrs.LLtoMGRS([0,0],5).should.equal('31NAA6602100000');
  });
  it('MGRS reference with 5-digit accuracy, northing one digit', () => {
    mgrs.LLtoMGRS([0,0.00001],5).should.equal('31NAA6602100001');
  });
  it('MGRS reference with 0-digit accuracy correct.', () => {
    mgrs.LLtoMGRS(point, 0).should.equal('25XEN');
  });
});

describe ('third mgrs set', () => {
  const mgrsStr = '11SPA7234911844';
  const point = [-115.0820944, 36.2361322];
  it('MGRS reference with highest accuracy correct.', () => {
    mgrs.LLtoMGRS(point).should.equal(mgrsStr);
  });
  it('MGRS reference with 0-digit accuracy correct.', () => {
    mgrs.LLtoMGRS(point, 0).should.equal('11SPA');
  });
});

describe ('data validation', () => {
  describe('MGRStoLL function', () => {
    it('MGRStoLL throws an error when a blank string is passed in', () => {
      try {
        mgrs.MGRStoLL('');
        false.should.be.true; // to make sure it errors
      } catch (error) {
        error.should.be.a('error');
        error.message.should.equal('Received a blank string');
      }
    });
    it('MGRStoLL should return the same result whether or not spaces are included in the MGRS String', () => {
      const [ long1, lat1 ] = mgrs.MGRStoLL('4QFJ 12345 67890');
      const [ long2, lat2]  = mgrs.MGRStoLL('4QFJ1234567890');
      lat1.should.equal(lat2);
      long1.should.equal(long2);
    });
  });
  describe('LLtoMGRS function', () => {
    it('LLtoMGRS throws an error when array of strings passed in', () => {
      try {
        mgrs.LLtoMGRS(['40', '40']);
        false.should.be.true; // to make sure it errors
      } catch (error) {
        error.should.be.a('error');
        error.message.should.equal('Received an array of strings, expected an array of numbers');
      }
    });
    it('LLtoMGRS throws an error when longitude is outside bounds', () => {
      try {
        mgrs.LLtoMGRS([90, 180]);
        false.should.be.true; // to make sure it errors
      } catch (error) {
        error.should.be.a('error');
        error.message.should.equal('Received an invalid latitude of 180');
      }
    });
    it('LLtoMGRS throws an error when latitude is outside bounds', () => {
      try {
        mgrs.LLtoMGRS([90, 270]);
        false.should.be.true; // to make sure it errors
      } catch (error) {
        error.should.be.a('error');
        error.message.should.equal('Received an invalid latitude of 270');
      }
    });
    it('LLtoMGRS throws an error when latitude is near the north pole', () => {
      try {
        mgrs.LLtoMGRS([45, 88]);
        false.should.be.true; // to make sure it errors
      } catch (error) {
        error.should.be.a('error');
        error.message.should.equal('Received a latitude of 88. Support only conversions of points in polar regions below 80°S and above 84°N');
      }
    });
    it('LLtoMGRS throws an error when latitude is near the south pole', () => {
      try {
        mgrs.LLtoMGRS([45, -88]);
        false.should.be.true; // to make sure it errors
      } catch (error) {
        error.should.be.a('error');
        error.message.should.equal('Received a latitude of -88. Support only conversions of points in polar regions below 80°S and above 84°N');
      }
    });
  });
  describe('getLetterDesignator', () => {
    it('should return Z when latitude band is outside latitude handled by library', () => {
      const latitude = -83.3026329741;
      const letter = mgrs.getLetterDesignator(latitude);
      letter.should.equal('Z');
    });
  });
});

if (process.env.CHECK_GEOTRANS) {
  describe('Consistency with GEOTRANS', () => {
    it('Should be consistent with GEOTRANS', () => {
      const fileText = readFileSync('./test/testing-data.csv', 'utf8');
      const lines = fileText.split('\n')
        .filter(Boolean) // remove blank lines if any
        .slice(1); // remove header
      lines.forEach(line => {
        const [ mgrsString, expectedLongitude, expectedLatitude ] = line.split('\t');

        // mgrs library doesn't support polar regions
        if (['A','B','Y','Z'].includes(mgrsString[0])) return;

        const [ actualLongitude, actualLatitude ] = mgrs.MGRStoLL(mgrsString);
        try {
          actualLatitude.should.be.closeTo(Number.parseFloat(expectedLatitude), 0.0000015);
          actualLongitude.should.be.closeTo(Number.parseFloat(expectedLongitude), 0.0000015);
        } catch (error) {
          console.error('mgrsString:', mgrsString);
          throw error;
        }
      });
    });
  });
}
