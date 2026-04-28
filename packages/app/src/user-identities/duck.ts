import * as Immutable from 'immutable';
import { fromJS } from '../utils/ts';
import { StationUserIdentitiesImmutable } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Constants

export const CREATE = 'browserX/user-identities/CREATE';
export type CREATE = 'browserX/user-identities/CREATE';
export const DELETE = 'browserX/user-identities/DELETE';
export type DELETE = 'browserX/user-identities/DELETE';

export type AddedApplicationVia =
  'appstore'
  | 'subdock'
  | 'deeplink-auto-install'
  | 'onboarding'
  | 'settings-app-add-account'
  | 'settings-app-install-extension';

// Action Types

export type CreateIdentityAction = {
  type: CREATE,
  identityId: string,
  provider: string,
  userId: string,
  accessToken?: string,
  refreshToken?: string,
  profileData: any,
};
export type DeleteIdentityAction = { type: DELETE, identityId: string };
export type UserIdentityActions =
  CreateIdentityAction
  | DeleteIdentityAction;

// Action creators

export const createIdentity =
  ({ provider, userId, profileData, accessToken, refreshToken }:
     { provider: string, userId: string, profileData: any, accessToken?: string, refreshToken?: string }): CreateIdentityAction => ({
       type: CREATE,
       identityId: `${provider}-${userId}`, // ensure unicity
       provider,
       userId,
       accessToken,
       refreshToken,
       profileData,
     });

export const deleteIdentity = (identityId: string): DeleteIdentityAction => ({
  type: DELETE, identityId,
});

// Reducer
export default function reducer(state: StationUserIdentitiesImmutable = Immutable.Map() as any, action: UserIdentityActions):
  StationUserIdentitiesImmutable {
  switch (action.type) {
    case CREATE: {
      const {
        identityId,
        provider,
        userId,
        profileData,
        accessToken,
        refreshToken,
      } = action;
      return state.set(identityId, fromJS({
        identityId,
        provider,
        userId,
        accessToken,
        refreshToken,
        profileData,
      }));
    }
    case DELETE: {
      const { identityId } = action;
      return state.delete(identityId);
    }
    default:
      return state;
  }
}
