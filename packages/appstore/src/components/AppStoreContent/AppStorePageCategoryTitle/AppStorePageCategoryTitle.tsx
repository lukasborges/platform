import * as React from 'react';
import injectSheet from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';

import styles, { AppStorePageCategoryTitleClasses } from './styles';

export interface AppStorePageCategoryTitleProps {
  classes?: AppStorePageCategoryTitleClasses,
  title: string,
  subTitle?: string,
  iconUrl?: string,
  iconSymbol?: IconSymbol,
}

@injectSheet(styles)
class AppStorePageCategoryTitle extends React.PureComponent<AppStorePageCategoryTitleProps, {}> {

  render() {
    const { classes, title, subTitle, iconUrl, iconSymbol } = this.props;

    return (
      <React.Fragment>
        <div className={classes!.categoryTitle}>
          {!!iconUrl && <svg className={classes!.categoryIcon}>
            <use xlinkHref={iconUrl}/>
          </svg>}
          {!!iconSymbol &&
            <Icon className={classes!.categoryIcon} symbolId={iconSymbol} size={20}/>
          }
          <div className={classes!.categoryName}>{title}</div>
        </div>
        {!!subTitle && <div className={classes!.categorySubtitle}>{subTitle}</div>}
      </React.Fragment>
    );
  }
}

export default AppStorePageCategoryTitle;
