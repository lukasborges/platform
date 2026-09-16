import { RPC } from '../services/lib/types';
import services from '../services/servicesManager';
import { OSNotification } from '../services/services/os-notification/interface';

export const showOSNotification = async ({ notificationId, title, body, imageURL, silent }:
  { notificationId: string, title: string, body?: string, imageURL?: string, silent?: boolean }): Promise<RPC.Node<OSNotification>> => {

  return await services.osNotification.show({
    notificationId, title, body, imageURL, silent,
  });
};
