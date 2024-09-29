import { DriverInfo } from './event-api-data';
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

interface AddPenaltyPointData {
  leagueId: SgpEventSession['session']['leagueId'];
  participantId: DriverInfo['id'];
  points: number;
  raceIndex: number;
  reason: string;
  sessionId: SgpEventSession['session']['id'];
  tournamentId: SgpEventSession['session']['id'];
}

interface AddPointAdjustmentData extends AddPenaltyPointData {
  scope: 'CLASS';
}

interface RequestTypes {
  session: WithId;
  results: WithId;
  points: WithId;
  pointsAdjustments: WithId;
  penalties: WithId;
  status: WithId;
  championship: WithId;
  championshipSessions: WithId;
  championshipPoints: WithId;
  championshipPenalties: WithId;
  championshipEntryList: WithId;
  addPointsAdjustment: AddPointAdjustmentData;
  addPenaltyPoints: AddPenaltyPointData;
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
  addPointsAdjustment: {};
  addPenaltyPoints: {};
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
  addPointsAdjustment: '/stg/command/point-adjustments/add',
  addPenaltyPoints: '/stg/command/penalties/add',
};
const API_METHODS: Partial<Record<keyof RequestTypes, 'GET' | 'POST'>> = {
  addPointsAdjustment: 'POST',
  addPenaltyPoints: 'POST',
};

const apiCache = new Map<string, any>();

export async function callApi<T extends keyof RequestTypes>(
  type: T,
  data: RequestTypes[T]
) {
  const url =
    BASE_URL +
    (isWithId(data)
      ? API_PATH[type].replaceAll('{{ID}}', () => {
          const id = data.id;
          if (!id) {
            throw new Error(`No eventId provided`);
          }
          return id;
        })
      : API_PATH[type]);

  const method = API_METHODS[type] || 'GET';

  if (method === 'GET') {
    const cachedData = apiCache.get(url);
    if (cachedData) return cachedData;
  }

  const token = getAuthToken();
  if (!token) {
    throw new Error(`Couldn't found authorization token. Try reloading the page.`);
  }

  const headers = { Authorization: token };

  try {
    const res = await (method === 'GET'
      ? fetch(url, { headers })
      : fetch(url, { method, headers, body: JSON.stringify(data) }));
    const json = await res.json();

    apiCache.set(url, json);
    return json;
  } catch (e) {
    console.warn(`Warning when calling ${url}`, e);
    return { error: true, e };
  }
}

export function clearApiCache() {
  apiCache.clear();
}

function getAuthToken(): string | undefined {
  const rawToken = /auth._token.social=([^;]+)/.exec(document.cookie)?.[1];
  return rawToken ? decodeURIComponent(rawToken) : undefined;
}

function isWithId(
  data: WithId | AddPointAdjustmentData | AddPenaltyPointData
): data is WithId {
  return 'id' in data;
}
