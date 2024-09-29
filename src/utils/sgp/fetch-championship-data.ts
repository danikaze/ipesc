import { getPathId } from 'utils/sgp/get-path-id';
import { callApi } from './call-api';
import { fetchEventData } from './fetch-event-data';
import { SgpChampionshipApiData } from './championship-api-data';

export function fetchChampionshipData(championshipId?: string) {
  const id = championshipId ?? getPathId('championships');
  if (!id) {
    throw new Error(
      [
        'Usage:',
        ' * fetchChampionshipData(ID) or',
        ' * fetchChampionshipData() from a SGP Championship page (ID will be automatically detected)',
      ].join('\n')
    );
  }

  let cancelled = false;
  return {
    cancel: () => {
      console.log('Cancelling...');
      cancelled = true;
    },
    data: new Promise<SgpChampionshipApiData>(async (resolve) => {
      const requestData = { id };

      console.log(`Fetching data for championship ${id}`);
      const [championship, points, sessions, penalties, entryList] = await Promise.all([
        callApi('championship', requestData),
        callApi('championshipPoints', requestData),
        callApi('championshipSessions', requestData),
        callApi('championshipPenalties', requestData),
        callApi('championshipEntryList', requestData),
      ]);

      const events = [];

      for (let i = 0; i < sessions.length; i++) {
        if (cancelled) break;
        const session = sessions[i];
        const sessionId = session.id;
        console.log(
          `Fetching data for event ${sessionId} (${i + 1}/${sessions.length})...`
        );
        const eventData = await fetchEventData(sessionId);
        if (!eventData) continue;
        events.push(eventData);
      }

      console.log(`Fetched data for ${events.length}/${sessions.length} events.`);
      const res = new SgpChampionshipApiData({
        championship,
        points,
        sessions,
        events,
        penalties,
        entryList,
      });
      console.log(res);
      console.log(res.toJson());
      resolve(res);
    }),
  };
}
