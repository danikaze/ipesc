import {
  SgpEventSession,
  SgpSessionResults,
  SgpEventPoints,
  SgpEventPointsAdjustments,
  SgpChampionship,
  SgpChampionshipEntryList,
  SgpChampionshipPoints,
  SgpChampionshipSession,
  SgpSplitStatus,
} from './types';

interface WithId {
  id: string;
}

interface ReturnTypes {
  session: SgpEventSession;
  results: SgpSessionResults;
  points: SgpEventPoints;
  pointsAdjustments: SgpEventPointsAdjustments;
  penalties: SgpEventPointsAdjustments;
  status: SgpSplitStatus;
  championship: SgpChampionship;
  championshipSessions: SgpChampionshipSession[];
  championshipPoints: SgpChampionshipPoints;
  championshipPenalties: SgpEventPointsAdjustments;
  championshipEntryList: SgpChampionshipEntryList;
}

const BASE_URL = 'https://stg-api.simracing.gp';
const API_PATH = {
  session: '/stg/sessions/{{ID}}',
  results: '/stg/results/{{ID}}',
  points: '/stg/query/points/session/{{ID}}',
  pointsAdjustments: '/stg/query/point-adjustments/session/{{ID}}',
  penalties: '/stg/query/penalties/session/{{ID}}',
  status: '/stg/query/split-status/{{ID}}',
  championship: '/stg/query/championship/{{ID}}',
  championshipSessions: '/stg/session-views/tournament-sessions/{{ID}}',
  championshipPoints: '/stg/query/points/tournament/{{ID}}?type=CHAMPIONSHIP',
  championshipPenalties: '/stg/query/penalties/tournament/{{ID}}',
  championshipEntryList: '/stg/query/entry-list/{{ID}}',
};

const apiCache = new Map<string, any>();

export async function callApi<T extends keyof typeof API_PATH>(
  type: T,
  data: WithId
): Promise<ReturnTypes[T]>;
export async function callApi(type: keyof typeof API_PATH, data: WithId) {
  const url =
    BASE_URL +
    API_PATH[type].replaceAll('{{ID}}', () => {
      const id = data.id;
      if (!id) {
        throw new Error(`No eventId provided`);
      }
      return id;
    });

  const cachedData = apiCache.get(url);
  if (cachedData) return cachedData;

  const token = getAuthToken();
  if (!token) {
    throw new Error(`Couldn't found authorization token. Try reloading the page.`);
  }

  const headers = { Authorization: token };

  try {
    const res = await fetch(url, { headers });
    const json = await res.json();

    apiCache.set(url, json);
    return json;
  } catch (e) {
    console.warn(`Warning when calling ${url}`, e);
    return;
  }
}

export function clearApiCache() {
  apiCache.clear();
}

function getAuthToken(): string | undefined {
  const rawToken = /auth._token.social=([^;]+)/.exec(document.cookie)?.[1];
  return rawToken ? decodeURIComponent(rawToken) : undefined;
}
