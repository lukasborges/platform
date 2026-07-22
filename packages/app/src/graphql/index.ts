import { ReactiveSchemaLink } from '@getstation/apollo-link-reactive-schema';
import { concat } from 'apollo-link';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from 'graphql-tools';
import { IManifestProvider } from '../applications/manifest-provider/types';
import ResourceRouterDispatcher from '../resources/ResourceRouterDispatcher';
import { StationStoreWorker } from '../types';
import { addAllResolvers } from './allResolvers';
import { DistinctConsecutiveResultsLink } from './distinctConsecutiveResultsLink';

const typeDefs = require('./schema.graphql');

export type StationGQLContext = {
  store: StationStoreWorker,
  manifestProvider: IManifestProvider,
  resourceRouter: ResourceRouterDispatcher,
  pubsub: PubSub,
};

const schema = makeExecutableSchema<StationGQLContext>({ typeDefs });
addAllResolvers(schema);

/**
 * Returns an ApolloLink that executes operations against Platform's local
 * reactive schema in the worker process.
 */
export const getLink = (contextFn: () => StationGQLContext) => {
  return concat(
    new DistinctConsecutiveResultsLink(),
    new ReactiveSchemaLink<StationGQLContext>({
      schema,
      context: contextFn,
    })
  );
};
