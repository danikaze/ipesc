import { getPathId } from 'utils/sgp/get-path-id';
import { callApi } from './call-api';
import { SgpEventApiData } from './event-api-data';

export async function fetchEventData(
  eventId?: string
): Promise<undefined | SgpEventApiData> {
  const id = eventId ?? getPathId('events');
  if (!id) {
    console.warn(
      [
        'Usage:',
        ' * fetchEventData(ID) or',
        ' * fetchEventData() from a SGP Event page (ID will be automatically detected)',
      ].join('\n')
    );
    return;
  }

  const requestData = { id };
  const [session, results, points, penalties, pointsAdjustments] = await Promise.all([
    callApi('session', requestData),
    callApi('results', requestData),
    callApi('points', requestData),
    callApi('penalties', requestData),
    callApi('pointsAdjustments', requestData),
  ]);

  const res = new SgpEventApiData({
    session,
    results,
    points,
    penalties,
    pointsAdjustments,
  });

  console.log(res);
  return res;
}
