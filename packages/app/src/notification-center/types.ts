import { RecursiveImmutableMap } from '../types';

export interface NotificationProps {
  title: string,
  timestamp?: number,
  body: string,
  icon: string,
  silent?: boolean,
}

export interface StationNotification {
  snoozeDuration?: string,
  snoozeStartedOn?: number,
  notifications: string[],
}

export type StationNotificationImmutable = RecursiveImmutableMap<StationNotification>;
