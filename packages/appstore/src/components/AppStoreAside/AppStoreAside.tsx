import { ContextEnvPlatform } from '@src/app';
import { AppStoreContext } from '@src/context';
import * as React from 'react';
import injectSheet from 'react-jss';

import AppStoreAsideNav from './AppStoreAsideNav/AppStoreAsideNav';
import AppStoreSearchSection from './AppStoreSearchSection/AppStoreSearchSection';
import styles, { IClasses } from './styles';

export interface AppStoreAsideProps {
  classes?: IClasses,
  appStoreContext: number,
}

const withAppsStoreContext = (Component: React.ComponentType) => (props: any) => (
  <AppStoreContext.Consumer>
    {(appStoreContext) => <Component {...props} appStoreContext={appStoreContext} />}
  </AppStoreContext.Consumer>
);

@withAppsStoreContext
@injectSheet(styles)
class AppStoreAside extends React.PureComponent<AppStoreAsideProps, {}> {
  render() {
    const { classes, appStoreContext } = this.props;

    return (
      <React.Fragment>
        <aside className={classes!.aside}>
          <div>
            <AppStoreSearchSection appStoreContext={appStoreContext} />
            <AppStoreAsideNav appStoreContext={appStoreContext} />
          </div>

          {appStoreContext === ContextEnvPlatform.Browser &&
            <div className={classes!.info}>
              <div className={classes!.text}>Powered by</div>
              <a
                className={classes!.brandLink}
                href="https://github.com/lukasborges/platform"
                target="_blank"
                aria-label="Platform GitHub"
              >
                platform
              </a>
            </div>
          }
        </aside>
      </React.Fragment>
    );
  }
}

export default AppStoreAside;
