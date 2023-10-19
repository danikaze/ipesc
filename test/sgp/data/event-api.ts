import * as btcc from '../../../raw-sgp-data/btcc.json';
import * as s4 from '../../../raw-sgp-data/s4.json';
import * as s7 from '../../../raw-sgp-data/s7.json';

import { SgpEventApiData } from 'utils/sgp/event-api-data';

// AC BTCC Race
// https://app.simracing.gp/events/QPZoLNGI3tjdD5InNVHdO
export const btccRace = SgpEventApiData.fromJson(btcc.events[4]);

// S7 Rnd2 Suzuka
// https://app.simracing.gp/events/z28x2BVIl6ptHfzuza4a1
export const s7fullSingleRace = SgpEventApiData.fromJson(s7.events[1]);

// S7 Rnd6 Brands Hatch sprint x2
// https://app.simracing.gp/events/ZkVFqoJVQVUmNa6r0Sb1I
export const s7fullDoubleSprint = SgpEventApiData.fromJson(s7.events[5]);

// S4 Rnd 2 Silverstone (WET)
// https://app.simracing.gp/events/7RQmsS_dLbjT5GoSlanbk
export const s4singleRace = SgpEventApiData.fromJson(s4.events[1]);
