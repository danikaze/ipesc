import {
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DriverInfo } from 'utils/sgp/event-api-data';
import { useUiContext } from '../context';
import { UiButton } from '../ui-button';
import { UiDialog } from '../ui-dialog';
import {
  getPenaltyQuerier,
  PenaltyMultiplier,
  PenaltyQuerier,
  PenaltyTier,
} from './definition';
import { clsx } from 'clsx';

import styles from './penalties.module.scss';
import { calculateActions } from './calculate-actions';
import { msToTime } from 'utils/time';

export interface PenaltyData {
  raceIndex: number;
  driver: DriverInfo;
  tier: PenaltyTier;
  mult: PenaltyMultiplier;
}

export type ActionData =
  | AddPenaltyPoints
  | AddPenaltyAdjustment
  | AddFastestLapAdjustment;

export interface AddPenaltyPoints {
  type: 'PP';
  raceIndex: number;
  driver: DriverInfo;
  points: number;
}

export interface AddPenaltyAdjustment {
  type: 'PENALTY';
  raceIndex: number;
  driver: DriverInfo;
  points: number;
  oldTime: number;
  newTime: number;
  oldPos: number;
  newPos: number;
}

export interface AddFastestLapAdjustment {
  type: 'FASTEST_LAP';
  raceIndex: number;
  driver: DriverInfo;
  points: number;
}

const SHOW_COPY_MSG_MS = 1500;
const DIALOG_TITLE = 'Points adjustment and Penalties';

export const PenaltyDialog: FC = () => {
  const { closePenaltyDialog, eventData } = useUiContext();
  const drivers = useMemo(
    () => eventData?.getDrivers('active').sort((a, b) => a.name.localeCompare(b.name)),
    [eventData]
  );
  const getPenalty = useMemo(
    () => getPenaltyQuerier(eventData?.getTrackName()!),
    [eventData]
  );

  const [penalties, setPenalties] = useState<PenaltyData[]>([]);
  const [actions, setActions] = useState<ActionData[]>([]);
  const raceRef = useRef<HTMLSelectElement>(null);
  const driverRef = useRef<HTMLSelectElement>(null);
  const tierRef = useRef<HTMLSelectElement>(null);
  const multRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setActions(calculateActions(eventData, penalties, getPenalty));
  }, [eventData, penalties, getPenalty]);

  if (!eventData || !drivers || !getPenalty) {
    const errorMsg = !eventData
      ? 'No data available for this event.'
      : !drivers
      ? 'Error fetching the drivers from the event.'
      : !getPenalty
      ? `No penalty definition for circuit "${eventData.getTrackName()}"`
      : undefined;
    return (
      <UiDialog title={DIALOG_TITLE} onClose={closePenaltyDialog}>
        {errorMsg}
      </UiDialog>
    );
  }

  const nRaces = eventData.getNumberOfRaces() || 0;
  const addPenalty = useCallback(() => {
    const race = Number(raceRef.current?.value) || 0;
    const driver = drivers.find((driver) => driver.id === driverRef.current?.value);
    const tier = Number(tierRef.current?.value) as PenaltyTier;
    const mult = Number(multRef.current?.value) as PenaltyMultiplier;

    if (!driver || !tier) return;

    setPenalties((penalties) => [
      ...penalties,
      {
        raceIndex: race,
        driver,
        tier,
        mult,
      },
    ]);
  }, [drivers]);

  const removePenalty = useCallback(
    (index: number) =>
      setPenalties((penalties) => {
        const newPenalties = [...penalties];
        newPenalties.splice(index, 1);
        return newPenalties;
      }),
    []
  );

  return (
    <UiDialog title={DIALOG_TITLE} onClose={closePenaltyDialog}>
      <div className={styles.root}>
        <div>
          {renderRaces(raceRef, nRaces)}
          {renderDrivers(driverRef, drivers)}
          {renderTiersAndAddButton(tierRef, multRef, getPenalty, addPenalty)}
        </div>

        {renderPenalties(penalties, nRaces > 1, getPenalty, removePenalty)}
        {renderActions(actions, nRaces > 1)}
      </div>
    </UiDialog>
  );
};

/**
 *
 */
function renderRaces(ref: RefObject<HTMLSelectElement>, n: number): ReactNode {
  if (n < 2) return;

  return (
    <div className={styles.input}>
      <div>Race</div>
      <div>
        <select ref={ref}>
          {new Array(n).fill(0).map((z, i) => (
            <option key={i} value={i}>
              Race {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 *
 */
function renderDrivers(
  ref: RefObject<HTMLSelectElement>,
  drivers: DriverInfo[]
): ReactNode {
  return (
    <div className={styles.input}>
      <div>Driver</div>
      <div>
        <select ref={ref}>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 *
 */
function renderTiersAndAddButton(
  tierRef: RefObject<HTMLSelectElement>,
  multRef: RefObject<HTMLSelectElement>,
  getPenalty: PenaltyQuerier,
  addPenalty: () => void
): ReactNode {
  return (
    <div className={styles.input}>
      <div>Tier</div>
      <div className={styles.tierAndButton}>
        <div>
          <select ref={tierRef}>
            {new Array(5).fill(0).map((z, i) => (
              <option key={i} value={i + 1}>
                Tier {i + 1} ({getPenalty((i + 1) as PenaltyTier)?.secs} s)
              </option>
            ))}
          </select>
          <select ref={multRef}>
            {new Array(3).fill(0).map((z, i) => (
              <option key={i} value={i + 1}>
                x{i + 1}
              </option>
            ))}
          </select>
        </div>
        <UiButton title='Draft the penalty' onClick={addPenalty}>
          +
        </UiButton>
      </div>
    </div>
  );
}

/**
 *
 */
function renderPenalties(
  penalties: PenaltyData[],
  showRaces: boolean,
  getPenalty: PenaltyQuerier,
  onRemove: (penaltyIndex: number) => void
): ReactNode {
  if (!penalties.length) return;

  return (
    <>
      <hr />
      <table>
        <thead>
          <tr>
            <th></th>
            {showRaces && <th>Race</th>}
            <th>Driver</th>
            <th>Tier</th>
          </tr>
        </thead>
        <tbody>
          {penalties.map(({ raceIndex: race, driver, tier, mult }, i) => (
            <tr key={i} className={clsx(i % 2 && styles.odd)}>
              <td>
                <span
                  title='Remove penalty'
                  className={styles.remove}
                  onClick={() => onRemove(i)}
                >
                  ✖
                </span>
              </td>
              {showRaces && <td>#{race + 1}</td>}
              <td>{driver.name}</td>
              <td>
                Tier {tier} ({getPenalty(tier)?.secs} s) {mult > 1 ? `x${mult}` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/**
 *
 */
function renderActions(actions: ActionData[], showRaces: boolean): ReactNode {
  const [copied, setCopied] = useState(false);
  const timeRef = useRef(0);
  const actionsPerRace = useMemo(() => getActionsPerRace(actions), [actions]);
  const copy = useCallback(() => {
    const text = getActionsText(actionsPerRace);
    navigator.clipboard.writeText(text);
    setCopied(true);
    timeRef.current && clearTimeout(timeRef.current);
    timeRef.current = window.setTimeout(() => setCopied(false), SHOW_COPY_MSG_MS);
  }, [actionsPerRace]);

  if (!actions.length) return;

  return (
    <>
      <hr />
      <div>
        List of actions to take
        <span title='Copy' onClick={copy} className={styles.copyIcon}>
          ⎘
        </span>
        <span className={clsx(styles.copiedMsg, copied && styles.show)}>Copied!</span>
      </div>
      {actionsPerRace.map((actions, i) => renderActionsTable(actions, showRaces, i))}
    </>
  );
}

function renderActionsTable(
  actions: ActionData[],
  showRaces: boolean,
  i: number
): ReactNode {
  return (
    <table key={i}>
      {showRaces && <caption>Race {i + 1}</caption>}
      <thead>
        <tr>
          <th>Driver</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {actions.map((action, i) => {
          return action.type === 'FASTEST_LAP' ? (
            renderFastestLapAction(action, i)
          ) : action.type === 'PP' ? (
            renderPpAction(action, i)
          ) : action.type === 'PENALTY' ? (
            renderPenaltyAction(action, i)
          ) : (
            <tr>
              <td colSpan={2}>Unknown action</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function renderFastestLapAction(action: AddFastestLapAdjustment, i: number): ReactNode {
  const catName = driverCategory(action.driver);
  return (
    <tr key={i} className={clsx(i % 2 && styles.odd)}>
      <td>{action.driver.name}</td>
      <td>
        <span className={styles.points}>+{action.points}</span>{' '}
        {plural('point', action.points)} for the Fastest Lap{catName}
      </td>
    </tr>
  );
}

function renderPpAction(action: AddPenaltyPoints, i: number): ReactNode {
  return (
    <tr key={i} className={clsx(i % 2 && styles.odd)}>
      <td>{action.driver.name}</td>
      <td>
        <span className={styles.points}>+{action.points}</span> Penalty{' '}
        {plural('Point', action.points)}
      </td>
    </tr>
  );
}

function renderPenaltyAction(action: AddPenaltyAdjustment, i: number): ReactNode {
  const posDiff = Math.abs(action.newPos - action.oldPos);
  if (action.points < 0) {
    return (
      <tr key={i} className={clsx(i % 2 && styles.odd, !action.points && styles.zero)}>
        <td>{action.driver.name}</td>
        <td>
          Pts. Adj. to <span className={styles.points}>{action.points}</span> due to
          dropping {count('position', posDiff)} (P{action.oldPos} → P{action.newPos} /{' '}
          {msToTime(action.oldTime)} → {msToTime(action.newTime)})
        </td>
      </tr>
    );
  }
  return (
    <tr key={i} className={clsx(i % 2 && styles.odd, !action.points && styles.zero)}>
      <td>{action.driver.name}</td>
      <td>
        Pts. Adj. to <span className={styles.points}>+{action.points}</span> due to
        gaining {count('position', posDiff)} (P{action.oldPos} → P{action.newPos}) after
        resolving penalties
      </td>
    </tr>
  );
}

function getActionsText(actions: ActionData[][]): string {
  const title = `:checkered_flag: Post-race Actions:`;

  if (actions.length === 1) {
    const actionsText = getRaceActionsText(actions[0]);
    return [title, actionsText].join('\n');
  }

  const raceTexts = actions.reduce(
    (text, raceActions, i) => {
      text.push(` ~~ RACE ${i + 1} ~~`);
      text.push(getRaceActionsText(raceActions));
      text.push('\n');
      return text;
    },
    [title] as string[]
  );

  return raceTexts.join('\n');
}

function getRaceActionsText(actions: ActionData[]): string {
  if (!actions.length) {
    return 'No adjustment to be done in the points or penalties for this session.';
  }

  return actions
    .reduce((lines, action) => {
      if (action.type === 'FASTEST_LAP') {
        lines.push(
          `- :fastestlap: +${count('point', action.points)} to **${
            action.driver.name
          }** for the fastest lap${driverCategory(action.driver)}`
        );
      } else if (action.type === 'PP') {
        lines.push(
          `- :penalty: +${action.points} Penalty ${count('Point', action.points)} to **${
            action.driver.name
          }**`
        );
      } else if (action.type === 'PENALTY') {
        const posDiff = Math.abs(action.newPos - action.oldPos);
        if (action.points > 0) {
          lines.push(
            `- :positionup: +${count('point', action.points)} to **${
              action.driver.name
            }** due to gaining ${count('position', posDiff)} (*P${action.oldPos} → P${
              action.newPos
            }*)`
          );
        } else if (action.points < 0) {
          lines.push(
            `- :positiondown: ${count('point', action.points)} to **${
              action.driver.name
            }** after resolving penalties ${count('position', posDiff)} (*P${
              action.oldPos
            } → P${action.newPos} / ${msToTime(action.oldTime)} → ${msToTime(
              action.newTime
            )}*)`
          );
        }
      }
      return lines;
    }, [] as string[])
    .join('\n');
}

function driverCategory(driver: DriverInfo): string {
  if (!driver.category) return '';

  const category = driver.category.toUpperCase();
  return category.startsWith('P')
    ? ' (PRO)'
    : category.startsWith('S')
    ? ' (SILVER)'
    : ' (AM)';
}

function plural(singular: string, n: number): string {
  return `${singular}${n === 1 ? '' : 's'}`;
}

function count(singular: string, n: number): string {
  return `${n} ${plural(singular, n)}`;
}

function getActionsPerRace(actions: ActionData[]): ActionData[][] {
  return actions.reduce((res, action) => {
    if (!res[action.raceIndex]) {
      res[action.raceIndex] = [];
    }
    res[action.raceIndex].push(action);
    return res;
  }, [] as ActionData[][]);
}
