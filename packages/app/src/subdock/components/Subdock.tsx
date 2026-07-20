import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';
import { Application } from '../types';
import { ITabSelectedInfo, ActiveTab } from '../Container';
import SubdockHead from './SubdockHead';
import SubdockPanel from './SubdockPanel';

interface Classes {
  container: string,
  panels: string,
}

interface Props {
  classes?: Classes,
  application: Application,
  applicationId: string,
  onOverStateChange: (change: boolean) => any,
  notificationsEnabled: boolean,
  themeGradient: string,
  activeTab: ActiveTab,
  onSelectTab: (tabId: string, info: ITabSelectedInfo) => any,
  onDetachTab: () => any,
  onAttachTab: () => any,
  onSelectFavorite: (tabId: string) => any,
  onAddTabAsFavorite: () => any,
  onRemoveFavorite: (favoriteId: string, tabId: string) => any,
  onDetachFavorite: () => any,
  onCloseTab: (tabId: string) => any,
  onOpenNewTab: () => void,
  onClickAddNewInstance: (application: Application) => void,
  openApplicationPreferences: (application: Application) => void,
  toggleNotifications: () => void,
  onChangeIcon: () => void,
  onResetIcon: () => void,
  hasCustomIcon: boolean,
  handleHideSubdock: () => void,
}

@injectSheet(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    zIndex: 4,
    border: '1px solid rgba(255, 255, 255, .1)',
    borderRadius: 12,
    boxShadow: '0 16px 48px rgba(0, 0, 0, .48)',
    maxHeight: 'calc(100vh - 76px)',
    overflow: 'hidden',
    backgroundColor: '#202124',
    backgroundAttachment: 'fixed',
  },
  panels: {
    flex: '1 1 auto',
    position: 'relative',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))
export default class Subdock extends React.PureComponent<Props, {}> {

  render() {
    const {
      classes, application, onOverStateChange, notificationsEnabled,
      handleHideSubdock, activeTab, onSelectTab, onDetachTab, onAttachTab, onSelectFavorite, onAddTabAsFavorite,
      onRemoveFavorite, onDetachFavorite, onCloseTab, onClickAddNewInstance, onOpenNewTab, openApplicationPreferences,
      toggleNotifications, onChangeIcon, onResetIcon, hasCustomIcon,
    } = this.props;

    const onMouseEnter = () => onOverStateChange(true);
    const onMouseLeave = () => onOverStateChange(false);

    return (
      <div className={`${classes!.container} station-subdock`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <SubdockHead
          application={application}
          notificationsEnabled={notificationsEnabled}
          openApplicationPreferences={openApplicationPreferences}
          toggleNotifications={toggleNotifications}
          onChangeIcon={onChangeIcon}
          onResetIcon={onResetIcon}
          hasCustomIcon={hasCustomIcon}
        />

        <div className={classes!.panels}>
          {application &&
            <SubdockPanel
              application={application}
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              onDetachTab={onDetachTab}
              onAttachTab={onAttachTab}
              onSelectFavorite={onSelectFavorite}
              onAddTabAsFavorite={onAddTabAsFavorite}
              onRemoveFavorite={onRemoveFavorite}
              onDetachFavorite={onDetachFavorite}
              onCloseTab={onCloseTab}
              onOpenNewTab={onOpenNewTab}
              onClickAddNewInstance={onClickAddNewInstance}
              handleHideSubdock={handleHideSubdock}
            />
          }
        </div>
      </div>
    );
  }
}
