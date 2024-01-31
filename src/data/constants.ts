import { join } from 'path';

export const ROOT_PATH = join(__dirname, '..', '..');
export const RAW_DATA_DIR = join(ROOT_PATH, 'raw-sgp-data');
export const OUTPUT_FILE = join(ROOT_PATH, 'processed-data', 'data.json');

export const CUSTOM_NAMES: Record<string, string> = {
  iVQvQbTrXqq2Fc__EiWHX: 'S1',
  'd9ZjDb-ye5UoHpB4gdm3S': 'S2',
  UokePNd9n2G7ld3UfRK97: 'S2.5',
  S9xGE1Hq0049Zjs6QVLUQ: 'S3',
  F3m9W00txELGkFJuUslLM: 'S4',
  'Fd36z3HxrgY6I5-lxmOuh': 'Rookies S1',
  '8uPv3wO1_cpTnus0wLtxw': 'Rookies S2',
  jehvtl2elJlJ8tmU01QY3: 'Rookies S3',
  '7E7SPYC13UZhPlq-yUWYL': 'S5',
  HmJXSR2OksoGBlT10eR_q: 'BTCC',
  hxjmRD7aBYGUsyiNlCVo3: 'S6',
  u1Alc5D09NQjUNC4xPSVm: 'S7',
  rkhFTtdoVJk0lPqegFMND: 'S8',
  V2Dk0HTCw4sMCFvTyW0r8: 'Post S7 MX5 micro-season',
};

export const TRACK_MAX_BEST_TIMES = 100;
