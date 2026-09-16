import { map } from 'rxjs/operators';

import { Resolvers } from '../graphql/resolvers-types.generated';
import { subscribeStore } from '../utils/observable';

import { checkForUpdates, openReleaseNotes, quitAndInstall } from './duck';
import {
  getDownloadProgress,
  getReleaseName,
  isCheckingUpdate,
  isDownloadingUpdate,
  isUpdateAvailable,
  isUpdateDownloaded,
} from './selectors';

export type AutoUpdateStatusParent = {};

const resolvers: Resolvers = {
  Query: {
    autoUpdateStatus: () => ({}),
  },
  AutoUpdateStatus: {
    isDownloadingUpdate: (_obj, _args, context) => {
      return subscribeStore(context.store, isDownloadingUpdate)
        .pipe(map(Boolean));
    },
    isCheckingUpdate: (_obj, _args, context) => {
      return subscribeStore(context.store, isCheckingUpdate)
        .pipe(map(Boolean));
    },
    isUpdateAvailable: (_obj, _args, context) => {
      return subscribeStore(context.store, isUpdateAvailable)
        .pipe(map(Boolean));
    },
    isUpdateDownloaded: (_obj, _args, context) => {
      return subscribeStore(context.store, isUpdateDownloaded)
        .pipe(map(Boolean));
    },
    downloadProgress: (_obj, _args, context) => {
      return subscribeStore(context.store, getDownloadProgress)
        .pipe(map(p => p === undefined || p === null ? null : Number(p)));
    },
    releaseName: (_obj, _args, context) => {
      return subscribeStore(context.store, getReleaseName as () => string)
        // Waiting for https://github.com/mesosphere/reactive-graphql/pull/19
        .pipe(map(r => r === undefined ? null : r));
    },
  },
  Mutation: {
    checkForUpdates: (_obj, _args, context) => {
      context.store.dispatch(checkForUpdates());
      return true;
    },
    openReleaseNotes: (_obj, _args, context) => {
      context.store.dispatch(openReleaseNotes());
      return true;
    },
    quitAndInstall: (_obj, _args, context) => {
      context.store.dispatch(quitAndInstall());
      return true;
    },
  },
};

export default resolvers;
