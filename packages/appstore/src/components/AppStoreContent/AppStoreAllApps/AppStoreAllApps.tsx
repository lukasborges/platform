import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import injectSheet from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';
import AppStoreAllAppsList from '@src/components/AppStoreContent/AppStoreAllAppsList/AppStoreAllAppsList';
import { allAppsCategoriesList } from '@src/shared/constants/constants';
import withBurgerMenuStatus, { WithBurgerMenuStatus } from '@src/HOC/withBurgerMenuStatus';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';

import { MinimalApplication } from '../../../../../app/applications/graphql/withApplications';

import styles, { AppStoreAllAppsClasses } from './styles';

const { flowRight: compose } = _;

export interface AppStoreAllAppsProps {
  classes?: AppStoreAllAppsClasses,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
  allCategories: string[],
  applicationsByCategory: Record<string, MinimalApplication[]>,
}

export type AppStoreAllAppsComponentProps = AppStoreAllAppsProps & WithBurgerMenuStatus;

export interface AppStoreAllAppsState {
  selectedCategory?: string | undefined,
  isDropDownOpen?: boolean,
}

class AppStoreAllApps extends React.PureComponent<AppStoreAllAppsComponentProps, AppStoreAllAppsState> {
  constructor(props: AppStoreAllAppsProps) {
    super(props);

    this.state = {
      selectedCategory: _.first(this.props.allCategories),
      isDropDownOpen: false,
    };
  }

  componentDidMount() {
    scrollToTop();
  }

  componentDidUpdate(prevProps: AppStoreAllAppsComponentProps) {
    if (_.isEqual(prevProps, this.props)) {
      return;
    }
    if (this.props.allCategories && this.props.allCategories.length) {
      this.setState({ selectedCategory: _.first(this.props.allCategories) });
    }
    if (prevProps.isBurgerOpen !== this.props.isBurgerOpen && this.props.isBurgerOpen) {
      this.setState({ isDropDownOpen: false });
    }
  }

  onSelectCategory = (selectedCategory: string) => {
    scrollToTop();
    this.setState({ selectedCategory, isDropDownOpen: false });
  }

  toggleMenu = () => {
    this.setState({ isDropDownOpen: !this.state.isDropDownOpen });
  }

  render() {
    const { classes, allCategories, applicationsByCategory, appStoreContext, onAddApplication } = this.props;
    const { selectedCategory } = this.state;
    const renderPageContent = allCategories && !!allCategories.length;

    return (
      <React.Fragment>
        {renderPageContent &&
          <section className={classes!.allAppsSection}>
            <nav className={classes!.categoriesContainer} aria-label="App categories">
              <ul className={classes!.categoriesList}>
                {allCategories.map(categoryName => {
                  const category = allAppsCategoriesList.find(item => item.title === categoryName);
                  return (
                    <li key={categoryName}>
                      <button
                        type="button"
                        className={classNames(
                          classes!.categoriesItem,
                          { isActive: categoryName === selectedCategory }
                        )}
                        onClick={() => this.onSelectCategory(categoryName)}
                      >
                        {!!category &&
                          <Icon className={classes!.categoryIcon} symbolId={category.icon} size={18}/>
                        }
                        <span className={classes!.categoryText}>{categoryName}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className={classes!.dropDown}>
              <button
                type="button"
                className={classes!.dropDownTitleContainer}
                onClick={this.toggleMenu}
                aria-expanded={this.state.isDropDownOpen}
              >
                <span className={classes!.dropDownTitle}>{selectedCategory || 'Categories'}</span>
                <Icon
                  symbolId={IconSymbol.ARROW_BACK}
                  size={16}
                  className={classNames(classes!.dropDownIcon, { isActive: this.state.isDropDownOpen })}
                />
              </button>

              <ul className={classNames(classes!.dropDownCategoriesList, { isActive: this.state.isDropDownOpen })}>
                {allCategories.map(categoryName => {
                  const category = allAppsCategoriesList.find(item => item.title === categoryName);
                  return (
                    <li key={categoryName}>
                      <button
                        type="button"
                        className={classNames(
                          classes!.dropDownCategoriesItem,
                          { isActive: categoryName === selectedCategory }
                        )}
                        onClick={() => this.onSelectCategory(categoryName)}
                      >
                        {!!category &&
                          <Icon className={classes!.categoryIcon} symbolId={category.icon} size={18}/>
                        }
                        <span className={classes!.categoryText}>{categoryName}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {!!allCategories && allCategories.length &&
              <AppStoreAllAppsList
                categoryName={selectedCategory}
                applicationsByCategory={applicationsByCategory}
                appStoreContext={appStoreContext}
                onAddApplication={onAddApplication}
              />
            }
          </section>
        }
      </React.Fragment>
    );
  }
}

export default compose(withBurgerMenuStatus, injectSheet(styles))(AppStoreAllApps);
