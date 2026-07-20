import { ipcRenderer } from 'electron';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { PICK_CUSTOM_ICON_CHANNEL, REMOVE_CUSTOM_ICON_CHANNEL } from '../../custom-icons/channels';
import {
  PickCustomIconAction,
  ResetCustomIconAction,
  setCustomApplicationIconURL,
} from '../duck';
import { getApplicationById } from '../selectors';

export function* pickCustomIcon({ applicationId }: PickCustomIconAction): SagaIterator {
  const application = yield select(getApplicationById, applicationId);
  if (!application) return;

  const customIconURL: string | null = yield call(
    [ipcRenderer, ipcRenderer.invoke],
    PICK_CUSTOM_ICON_CHANNEL,
    applicationId,
  );
  if (!customIconURL) return;

  yield put(setCustomApplicationIconURL(applicationId, customIconURL));
}

export function* resetCustomIcon({ applicationId }: ResetCustomIconAction): SagaIterator {
  const application = yield select(getApplicationById, applicationId);
  if (!application) return;

  yield call(
    [ipcRenderer, ipcRenderer.invoke],
    REMOVE_CUSTOM_ICON_CHANNEL,
    applicationId,
  );
  yield put(setCustomApplicationIconURL(applicationId, null));
}
