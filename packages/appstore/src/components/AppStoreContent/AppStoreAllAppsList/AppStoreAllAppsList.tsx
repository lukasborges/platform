import * as React from 'react';
import injectSheet from 'react-jss';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import { allAppsCategoriesList } from '@src/shared/constants/constants';
import AppStorePageCategoryTitle
  from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';

import { MinimalApplication } from '../../../../../app/applications/graphql/withApplications';

import styles, { AppStoreAllAppsListClasses } from './styles';

export interface AppStoreAllAppsProps {
  classes?: AppStoreAllAppsListClasses,
  categoryName: string,
  applicationsByCategory: Record<string, MinimalApplication[]>,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
}

@injectSheet(styles)
class AppStoreAllAppsList extends React.PureComponent<AppStoreAllAppsProps> {
  render() {
    const {
      classes,
      categoryName,
      appStoreContext,
      onAddApplication,
      applicationsByCategory,
    } = this.props;

    const apps = applicationsByCategory[categoryName] || [];

    const renderPageContent = apps && !!apps.length;
    const currentCategory = allAppsCategoriesList.find(category => category.title === categoryName);

    return (
      <React.Fragment>
        {!renderPageContent ?
          <AppStorePreloader isAnimationStopped={!!renderPageContent}/>
          :
          <div className={classes!.container}>
            <AppStorePageCategoryTitle
              title={categoryName}
              iconSymbol={currentCategory && currentCategory.icon}
            />

            <ul className={classes!.resultsContent}>
              {apps && apps.map(app => {
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
        }
      </React.Fragment>
    );
  }
}

export default AppStoreAllAppsList;
