/* eslint-disable global-require, import/first */
import './utils/stat-cache';
import './dotenv';
import { webFrame, ipcRenderer } from 'electron';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import './theme/css/app.global.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';
import { handleError } from './services/api/helpers';
import configureStore from './store/configureStore.client';
import ReduxBasedGradientProvider from './theme/ReduxBasedGradientProvider';
import { getGQlClient } from './utils/graphql';
import ConsoleErrorBoundary from './common/containers/ConsoleErrorBoundary';
import { renderRootAndNotify } from './common/helpers/renderRoot';
import { initializeAppearanceTheme } from './theme/appearance';
import PlatformThemeProvider from './theme/PlatformThemeProvider';

import { ActionsBusReactContext, createActionsEmitter, createActionsBus } from './store/actionsBus';

initializeAppearanceTheme();

// prevent app pinch zomming
webFrame.setVisualZoomLevelLimits(1, 1);

const apolloClient = getGQlClient();

const actionsEmitter = createActionsEmitter();
const actionsBus = createActionsBus(actionsEmitter);
const root = createRoot(document.getElementById('root'));

configureStore(actionsEmitter)
  .then(store => {
    // for debug purpose, gives us a way to easily access the store
    window.stationStore = store;

    render(store);

    return null;
  })
  .catch(handleError());

const render = (store) => {
  const App = require('./containers/App').default; // eslint-disable-line global-require

  renderRootAndNotify(root, (
    <Provider store={store}>
      <ActionsBusReactContext.Provider value={{ actionsBus }}>
        <ApolloProvider client={apolloClient}>
          <PlatformThemeProvider>
            <ReduxBasedGradientProvider>
              <ConsoleErrorBoundary>
                <App />
              </ConsoleErrorBoundary>
            </ReduxBasedGradientProvider>
          </PlatformThemeProvider>
        </ApolloProvider>
      </ActionsBusReactContext.Provider>
    </Provider>
  ), () => ipcRenderer.send('bx-ready-to-show'));
};

if (module.hot) {
  module.hot.accept();
}
