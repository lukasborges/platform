import { createSelector } from 'reselect';
import { StationState } from '../types';
import { INFINITE, SYNC_WITH_OS } from './constants';
import ms = require('ms');

export const getSnoozeDuration = (state: StationState): string | undefined =>
  state.getIn(['notificationCenter', 'snoozeDuration']);

export const getSnoozeDurationInMs = (state: StationState): number | string | undefined => {
  const currentSnoozeDuration = getSnoozeDuration(state);

  if (currentSnoozeDuration === SYNC_WITH_OS) return SYNC_WITH_OS;
  if (currentSnoozeDuration === INFINITE) return INFINITE;

  return currentSnoozeDuration ? ms(currentSnoozeDuration) : undefined;
};

export const getSnoozeState = (state: StationState): boolean => {
  const currentSnoozeDurationInMs = getSnoozeDurationInMs(state);
  if (!currentSnoozeDurationInMs) return false;
  return currentSnoozeDurationInMs > 0 || currentSnoozeDurationInMs === SYNC_WITH_OS || currentSnoozeDurationInMs === INFINITE;
};

export const getSnoozeStartedOn = (state: StationState): number | undefined =>
  state.getIn(['notificationCenter', 'snoozeStartedOn']);

export const getNotifications = (state: StationState) =>
  state.getIn(['notificationCenter', 'notifications']);

export const getNotificationBadgeCount = createSelector(
  [getNotifications, getSnoozeDuration],
  (notifications, snoozeDuration) => snoozeDuration ? 0 : notifications.size
);
