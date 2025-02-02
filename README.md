# mgrs

Utility for converting between WGS84 lat/long and MGRS coordinates, spunoff from [proj4js](https://github.com/proj4js/proj4js)

## Usage

```sh
npm install mgrs
```

### ES6:
```js
import { LLtoMGRS, MGRStoLL, MGRStoBBoxLL } from 'mgrs';

const mgrs = LLtoMGRS([-77.03650573264287, 38.89773371566278]);
const [long, lat] = MGRStoLL('18SUJ2339307399');
const boundingLatlong = MGRStoBBoxLL('18SUJ2339307399');
```

### CommonJS:
```js
const mgrs = require('mgrs');

const mgrs = mgrs.LLtoMGRS([-77.03650573264287, 38.89773371566278]);
const [long, lat] = mgrs.MGRStoLL('18SUJ2339307399');
const boundingLatlong = mgrs.MGRStoBBoxLL('18SUJ2339307399');
```

## Contribute

Install dependencies
```bash
npm install
```

Run test
```bash
npm test
```

Build package
```bash
npm run build
```

## References
- Wikipedia: https://en.wikipedia.org/wiki/Military_Grid_Reference_System
- GEOTRANS: https://earth-info.nga.mil/#geotrans

---

Licensed under the MIT license except:

Portions of this software are based on a port of components from the OpenMap
com.bbn.openmap.proj.coords Java package. An initial port was initially created
by Patrice G. Cappelaere and included in Community Mapbuilder
(http://svn.codehaus.org/mapbuilder/), which is licensed under the LGPL license
as per http://www.gnu.org/copyleft/lesser.html. OpenMap is licensed under the
[this license agreement](openmap.md)
