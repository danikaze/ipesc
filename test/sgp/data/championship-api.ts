import * as btccJson from '../../../raw-sgp-data/btcc.json';
import * as s4Json from '../../../raw-sgp-data/s4.json';
import * as s7Json from '../../../raw-sgp-data/s7.json';

import { SgpChampionshipApiData } from 'utils/sgp/championship-api-data';

// AC BTCC
// https://app.simracing.gp/championships/HmJXSR2OksoGBlT10eR_q
export const btcc = SgpChampionshipApiData.fromJson(btccJson);

// ACC S4
// https://app.simracing.gp/championships/F3m9W00txELGkFJuUslLM
export const s4 = SgpChampionshipApiData.fromJson(s4Json);

// ACC S7
// https://app.simracing.gp/championships/u1Alc5D09NQjUNC4xPSVm
export const s7 = SgpChampionshipApiData.fromJson(s7Json);
