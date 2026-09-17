/* eslint-disable global-require,import/imports-first */
import './utils/stat-cache';
import './dotenv';
import { webFrame, ipcRenderer } from 'electron';
import * as remote from '@electron/remote';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import './theme/css/app.global.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';
import { handleError } from './services/api/helpers';
import configureStore from './store/configureStore.client';
import { initializeAppearanceTheme } from './theme/appearance';
import PlatformThemeProvider from './theme/PlatformThemeProvider';
import ConsoleErrorBoundary from './common/containers/ConsoleErrorBoundary';
import { renderRootAndNotify } from './common/helpers/renderRoot';
import { getGQlClient } from './utils/graphql';

import { ActionsBusReactContext, createActionsEmitter, createActionsBus } from './store/actionsBus';

initializeAppearanceTheme();

// prevent app pinch zomming
webFrame.setVisualZoomLevelLimits(1, 1);

const currentWindow = remote.getCurrentWindow();

const client = getGQlClient();
const actionsEmitter = createActionsEmitter();
const actionsBus = createActionsBus(actionsEmitter);
const root = createRoot(document.getElementById('root'));

configureStore(actionsEmitter)
  .then(store => {
    // for debug purpose, gives us a way to easily access the store
    window.stationStore = store;

    render(store);
  })
  .catch(handleError());

const render = (store) => {
  const AppSub = require('./containers/AppSub').default; // eslint-disable-line global-require

  renderRootAndNotify(root, (
    <Provider store={store}>
      <ConsoleErrorBoundary>
        <ActionsBusReactContext.Provider value={{ actionsBus }}>
          <ApolloProvider client={client}>
            <PlatformThemeProvider>
              <AppSub subData={currentWindow.subData} />
            </PlatformThemeProvider>
          </ApolloProvider>
        </ActionsBusReactContext.Provider>
      </ConsoleErrorBoundary>
    </Provider>
  ), () => ipcRenderer.send('bx-ready-to-show'));
};

if (module.hot) {
  module.hot.accept();
}
