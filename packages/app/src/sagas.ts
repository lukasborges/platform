/* eslint-disable global-require */
import { all, call, spawn } from 'redux-saga/effects';

function createAsyncImport(...args: any[]) {
  return function* asyncImport(importPromise: Promise<any>) {
    const w = yield call(() => importPromise.then(y => y.default || y));
    // Start the long-running saga only after its module has loaded, then let
    // this registration task finish so startup can reliably signal readiness.
    yield (spawn as any)(w, ...args);
  };
}

export default function* root(bxApp: any) {
  yield all([
    call(createAsyncImport(bxApp), import('./activity/sagas')),
    call(createAsyncImport(bxApp), import('./bang/sagas')),
    call(createAsyncImport(bxApp), import('./history/sagas')),
    call(createAsyncImport(bxApp), import('./dl-toaster/sagas')),
    call(createAsyncImport(bxApp), import('./downloads/sagas')),
    call(createAsyncImport(bxApp), import('./app/sagas')),
    call(createAsyncImport(bxApp), import('./ordered-favorites/sagas')),
    call(createAsyncImport(bxApp), import('./favorites/sagas')),
    call(createAsyncImport(bxApp), import('./applications/sagas')),
    call(createAsyncImport(bxApp), import('./tab-webcontents/sagas')),
    call(createAsyncImport(bxApp), import('./in-tab-search/sagas')),
    call(createAsyncImport(bxApp), import('./auto-update/sagas')),
    call(createAsyncImport(bxApp), import('./ordered-tabs/sagas')),
    call(createAsyncImport(bxApp), import('./tabs/sagas')),
    call(createAsyncImport(bxApp), import('./subwindows/sagas')),
    call(createAsyncImport(bxApp), import('./dialogs/sagas')),
    call(createAsyncImport(bxApp), import('./notification-center/sagas')),
    call(createAsyncImport(bxApp), import('./onboarding/sagas')),
    call(createAsyncImport(bxApp), import('./theme/sagas')),
    call(createAsyncImport(bxApp), import('./settings/applications/sagas')),
    call(createAsyncImport(bxApp), import('./app-store/sagas')),
    call(createAsyncImport(bxApp), import('./ui/sagas')),
    call(createAsyncImport(bxApp), import('./user-activities/sagas')),
    call(createAsyncImport(bxApp), import('./password-managers/sagas')),
    call(createAsyncImport(bxApp), import('./plugins/sagas')),
    call(createAsyncImport(bxApp), import('./application-settings/sagas')),
    call(createAsyncImport(bxApp), import('./urlrouter/sagas')),
    call(createAsyncImport(bxApp), import('./abstract-application/sagas')),
  ]);
}
