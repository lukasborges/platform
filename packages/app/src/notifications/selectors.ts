import { StationState } from '../types';
import { getNotificationApplicationId } from './get';
import { ImmutableNotification, ImmutableNotifications } from './types';

export const getNotifications = (state: StationState): ImmutableNotifications =>
  state.get('notifications');

export const getNotificationById = (state: StationState, notificationId: string): ImmutableNotification | undefined =>
  getNotifications(state).get(notificationId);

export const getNotificationsRequests = (state: StationState) =>
  state
    .get('applications')
    .filter((application: any) => application.has('askEnableNotification'))
    .toList();

export const getNotificationIdsForApplication = (state: StationState, applicationId: string | undefined): string[] =>
  getNotifications(state)
    .filter((notification: any) => getNotificationApplicationId(notification) === applicationId)
    .keySeq()
    .toArray() as string[];
