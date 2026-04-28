import { map } from 'rxjs/operators';
import { Resolvers } from '../graphql/resolvers-types.generated';
import { subscribeStore } from '../utils/observable';
import { combineLatest } from 'rxjs';
import { getSettingsByManifestURL } from '../application-settings/selectors';
import { getApplicationsByManifestURL, getHomeTab } from '../applications/selectors';
import { getLink } from '../password-managers/selectors';
import { StationState } from '../types';
import {
  BxAppManifest,
} from '../applications/manifest-provider/bxAppManifest';
import {
  getApplicationId,
  getApplicationIconURL,
} from '../applications/get';
import { ApplicationImmutable } from '../applications/types';
import { interpretedIconUrl } from '../applications/helpers';
import {
  label,
  isConfigurationRequired,
} from './helpers';
import { getTabURL } from '../tabs/get';

const resolvers: Resolvers = {
  Query: {
    abstractApplication: (_, { manifestURL }, _context) => {
      return { manifestURL };
    },
  },
  Mutation: {
    checkForUpdatesApplication: (_obj, args, context) => {
      context.manifestProvider.update(args.manifestURL);
      return true;
    },
  },
  AbstractApplication: {
    manifestCheckedAt: ({ manifestURL }, __, context) => {
      const { manifestProvider } = context;

      return manifestProvider.get(manifestURL!)
        .pipe(map(bxApp => bxApp.lastChecked.fromNow()));
    },
    manifest: ({ manifestURL }, __, context) => {
      const { manifestProvider } = context;

      return manifestProvider.get(manifestURL!)
        .pipe(map(bxApp => bxApp.manifest));
    },
    settings: ({ manifestURL }, __, context) =>
      subscribeStore(
        context.store,
        state => getSettingsByManifestURL(state, manifestURL!)
      ),
    instances: ({ manifestURL }, __, context) =>
      combineLatest(
        subscribeStore(context.store, state => state),
        context.manifestProvider.get(manifestURL!)
          .pipe(map(bxApp => bxApp.manifest)),
        (state: StationState, manifest: BxAppManifest) => {
          const applications = getApplicationsByManifestURL(state, manifestURL!);

          return applications
            .valueSeq()
            .map((application: ApplicationImmutable) => {
              const link = getLink(state, getApplicationId(application));
              const id = getApplicationId(application);
              const name = label(state, manifest, application);
              const logoUrl = getApplicationIconURL(application) || interpretedIconUrl(manifest);
              const homeTabUrl = getTabURL(getHomeTab(state, id)) || '';
              const needConfiguration = isConfigurationRequired(manifest, application, homeTabUrl);
              const passwordManagerLink = link ? link.toJS() : { providerId: '', instanceId: '' };

              return { id, name, logoUrl, needConfiguration, passwordManagerLink };
            })
            .toJS();
        }
      ),
  },
};

export default resolvers;
