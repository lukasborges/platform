import * as React from 'react';
import injectSheet from 'react-jss';
import AppStorePageHeader from '@src/components/AppStoreContent/AppStorePageHeader/AppStorePageHeader';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';

import { FeaturedApps } from '../../../../../manifests';

import styles, { AppStoreMostPopularAppsClasses } from './styles';

export interface AppStoreMostPopularAppsProps {
  classes?: AppStoreMostPopularAppsClasses,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
  mostPopularApps?: FeaturedApps,
}

@injectSheet(styles)
class AppStoreMostPopularApps extends React.PureComponent<AppStoreMostPopularAppsProps> {

  componentDidMount() {
    scrollToTop();
  }

  render() {
    const { classes, appStoreContext, onAddApplication, mostPopularApps } = this.props;

    const title = 'Featured Apps';
    const subTitle = 'A curated selection for communication, planning, and focused work';
    const apps = mostPopularApps && mostPopularApps.featuredApps || [];
    const renderPageContent = !!apps.length;

    return (
      <React.Fragment>
        {!renderPageContent ?
          <AppStorePreloader isAnimationStopped={!!renderPageContent}/>
          :
          <section>
            <AppStorePageHeader
              title={title}
              subTitle={subTitle}
            />
            <div className={classes!.container}>
              <ul className={classes!.resultsContent}>
                {apps.map(app => {
                  return <AppStoreApplication
                    key={app.id}
                    application={app}
                    appStoreContext={appStoreContext}
                    onAddApplication={onAddApplication}
                    isCategoryNameDisplayed={false}
                  />;
                })}
              </ul>
            </div>
          </section>
        }
      </React.Fragment>
    );
  }
}

export default AppStoreMostPopularApps;
