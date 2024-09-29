import * as clsx from 'clsx';
import { FC, ReactNode } from 'react';
import { msToTime } from 'utils/time';
import { getDriverCategory } from './get-driver-category';
import {
  ActionData,
  ActionState,
  AddFastestLapAdjustment,
  AddPenaltyAdjustment,
  AddPenaltyPoints,
} from './penalty-dialog';
import { count, plural } from './plural';

import styles from './penalties.module.scss';

export interface Props {
  actions: ActionData[];
  showRaces: boolean;
  raceIndex: number;
}

export const ActionsTable: FC<Props> = ({ actions, showRaces, raceIndex }) => {
  return (
    <table>
      {showRaces && <caption>Race {raceIndex + 1}</caption>}
      <thead>
        <tr>
          <th>{/* state */}</th>
          <th>Driver</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {actions.map((action, i) => {
          const state = <ActionStatus action={action} />;

          return action.type === 'FASTEST_LAP' ? (
            <FastestLapRow key={i} i={i} action={action} state={state} />
          ) : action.type === 'PP' ? (
            <PpRow key={i} i={i} action={action} state={state} />
          ) : action.type === 'PENALTY' ? (
            <PenaltyRow key={i} i={i} action={action} state={state} />
          ) : (
            <tr>
              <td colSpan={3}>Unknown action</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

type ActionStatusProps = {
  action: ActionData;
};

const ActionStatus: FC<ActionStatusProps> = ({ action }) => {
  const { state } = action;
  const classes = clsx(
    styles.stateIcon,
    action.points ? styles[state.toLowerCase()] : styles.zero
  );
  const title =
    state === ActionState.WAITING
      ? 'Action drafted'
      : state === ActionState.ALREADY
      ? 'Action already applied'
      : state === ActionState.PROCESSING
      ? 'Processing action...'
      : state === ActionState.OK
      ? 'Action applied successfully'
      : state === ActionState.NG
      ? 'An error happened when trying to apply the action'
      : undefined;

  return <div className={classes} title={title} />;
};

type FastestLapRowProps = {
  i: number;
  action: AddFastestLapAdjustment;
  state: ReactNode;
};

const FastestLapRow: FC<FastestLapRowProps> = ({ i, action, state }) => {
  const catName = getDriverCategory(action.driver);
  return (
    <tr className={clsx(i % 2 && styles.odd)}>
      <td>{state}</td>
      <td>{action.driver.name}</td>
      <td>
        <span className={styles.points}>+{action.points}</span>{' '}
        {plural('point', action.points)} for the Fastest Lap{catName}
      </td>
    </tr>
  );
};

type PpRowProps = {
  i: number;
  action: AddPenaltyPoints;
  state: ReactNode;
};

const PpRow: FC<PpRowProps> = ({ i, action, state }) => {
  return (
    <tr className={clsx(i % 2 && styles.odd)}>
      <td>{state}</td>
      <td>{action.driver.name}</td>
      <td>
        <span className={styles.points}>+{action.points}</span> Penalty{' '}
        {plural('Point', action.points)}
      </td>
    </tr>
  );
};

type PenaltyRowProps = {
  i: number;
  action: AddPenaltyAdjustment;
  state: ReactNode;
};

const PenaltyRow: FC<PenaltyRowProps> = ({ i, action, state }) => {
  const posDiff = Math.abs(action.newPos - action.oldPos);
  if (action.points < 0) {
    return (
      <tr className={clsx(i % 2 && styles.odd, !action.points && styles.zero)}>
        <td>{state}</td>
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
      <td>{state}</td>
      <td>{action.driver.name}</td>
      <td>
        Pts. Adj. to <span className={styles.points}>+{action.points}</span> due to
        gaining {count('position', posDiff)} (P{action.oldPos} → P{action.newPos}) after
        resolving penalties
      </td>
    </tr>
  );
};
