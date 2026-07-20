import * as remote from '@electron/remote';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { toggleVisibility as toggleAppStore } from '../app-store/duck';
import { isVisible as isAppStoreVisible } from '../app-store/selectors';
import { setHomeTabAsActive } from '../applications/duck';
import { toggleVisibility as toggleQuickSwitch } from '../bang/duck';
import { isVisible as isQuickSwitchVisible } from '../bang/selectors';
// @ts-ignore: no declaration file
import { getFrontActiveTabId, getCurrentActiveTabProperty } from '../applications/utils';
import { getActiveApplicationId } from '../nav/selectors';
import { toggleVisibility as toggleNotificationCenter } from '../notification-center/duck';
import {
  getNotifications,
  getSnoozeDuration,
  isVisible as isNotificationCenterVisible,
} from '../notification-center/selectors';
import { executeWebviewMethodForCurrentTab } from '../tab-webcontents/duck';
import { getTabTitle } from '../tabs/get';
import { StationState } from '../types';

type IconName = 'menu' | 'plus' | 'search' | 'back' | 'forward' | 'reload' | 'home' | 'bell' |
  'minimize' | 'maximize' | 'restore' | 'close';

interface HeaderIconProps {
  name: IconName,
}

const HeaderIcon = ({ name }: HeaderIconProps) => {
  // Bundled Adwaita symbolic shapes matching the GTK icon names used by Syltr.
  const paths = {
    menu: (
      <>
        <path d="M1 2h14v2H1z" />
        <path d="M1 7h14v2H1z" />
        <path d="M1 12h14v2H1z" />
      </>
    ),
    plus: <path d="M7 1v6H1v2h6v6h2V9h6V7H9V1z" />,
    // Adwaita: system-search-symbolic
    search: <path d="M6.5 0C2.922 0 0 2.922 0 6.5s2.922 6.496 6.5 6.496c1.43 0 2.754-.465 3.828-1.254l2.945 2.946c.957.937 2.364-.5 1.407-1.438l-2.93-2.93A6.46 6.46 0 0 0 13 6.5C13 2.922 10.078 0 6.5 0Zm0 2C8.996 2 11 4.004 11 6.5s-2.004 4.496-4.5 4.496S2 8.996 2 6.5 4.004 2 6.5 2Z" />,
    back: <path d="M12 2a1 1 0 0 0-1.707-.707l-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L6.414 8l5.293-5.293A1 1 0 0 0 12 2Z" />,
    forward: <path d="M4 2a1 1 0 0 1 1.707-.707l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L9.586 8 4.293 2.707A1 1 0 0 1 4 2Z" />,
    reload: <path d="M7.406 1a7.5 7.5 0 1 0 6.59 11.25 1 1 0 0 0-1.734-1 5.5 5.5 0 1 1 0-5.5l.203.227-.02.015H11a1 1 0 0 0 0 2h5v-5a1 1 0 0 0-2 0v1.688l-.016.012A7.5 7.5 0 0 0 7.406 1Z" />,
    home: <path d="M8 .363c-.5 0-1 .168-1.406.508L2.129 4.594A3.13 3.13 0 0 0 1 7v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7a3.13 3.13 0 0 0-1.129-2.406L9.406.87A2.19 2.19 0 0 0 8 .363Zm-.016 1.996a.21.21 0 0 1 .145.047l4.465 3.723c.258.215.406.535.406.871v6a.99.99 0 0 1-1 1h-2V9a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v5H4a.99.99 0 0 1-1-1V7c0-.336.148-.656.406-.871L7.87 2.406a.2.2 0 0 1 .113-.047Z" />,
    bell: (
      <>
        <path d="M13.027 11a1 1 0 0 0 .945-1.324L13.602 8.6A11 11 0 0 1 13 5a5 5 0 0 0-10 0c0 1.223-.203 2.441-.602 3.598l-.37 1.078A1 1 0 0 0 2.972 11Zm-8.738-1.75A13 13 0 0 0 5 5a3 3 0 0 1 6 0c0 1.445.242 2.883.71 4.25l.372 1.074L13.027 9H2.973l.945 1.324Z" />
        <path d="M9.188 12.418A1.5 1.5 0 0 1 6.79 12.38a1 1 0 1 0-1.617 1.18 3.5 3.5 0 0 0 5.594.082 1 1 0 1 0-1.579-1.226Z" />
      </>
    ),
    minimize: <path d="M4 10.008h8v1.988H4z" />,
    maximize: <path d="M3.988 3.992v8.012H12V3.992Zm2 2H10v4.012H5.988Z" />,
    restore: <path d="M4.988 4.992v6.012H11V4.992Zm2 2H9v2.012H6.988Z" />,
    close: <path d="M4 4h1c.254.012.512.129.719.313L8 6.593l2.313-2.28c.265-.231.445-.305.687-.313h1v1c0 .285-.035.55-.25.75L9.47 8.031l2.25 2.25c.187.188.281.453.281.719v1h-1c-.266 0-.531-.094-.719-.281L8 9.437l-2.281 2.282A1.02 1.02 0 0 1 5 12H4v-1c0-.266.094-.531.281-.719l2.282-2.25L4.28 5.75A.94.94 0 0 1 4 5Z" />,
  };

  return (
    <svg aria-hidden="true" className="station-main-header__icon--symbolic" viewBox="0 0 16 16">
      {paths[name]}
    </svg>
  );
};

interface StateProps {
  activeApplicationId?: string,
  activeTabTitle: string,
  canGoBack: boolean,
  canGoForward: boolean,
  isLoading: boolean,
  appStoreVisible: boolean,
  quickSwitchVisible: boolean,
  notificationCenterVisible: boolean,
  notificationCount: number,
  notificationsSnoozed: boolean,
}

interface DispatchProps {
  onAddApplication: () => void,
  onToggleQuickSwitch: () => void,
  onGoBack: () => void,
  onGoForward: () => void,
  onReload: () => void,
  onGoHome: (applicationId: string) => void,
  onToggleNotifications: () => void,
}

interface OwnProps {
  onDoubleClick: () => void,
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  isMaximized: boolean,
}

class MainHeaderImpl extends React.PureComponent<Props, State> {
  state: State = {
    isMaximized: remote.getCurrentWindow().isMaximized(),
  };

  private menuButton: HTMLButtonElement | null = null;

  private mainWindow = remote.getCurrentWindow();

  componentDidMount() {
    this.mainWindow.on('maximize', this.updateMaximizedState);
    this.mainWindow.on('unmaximize', this.updateMaximizedState);
  }

  componentWillUnmount() {
    this.mainWindow.removeListener('maximize', this.updateMaximizedState);
    this.mainWindow.removeListener('unmaximize', this.updateMaximizedState);
  }

  private setMenuButtonRef = (button: HTMLButtonElement | null) => {
    this.menuButton = button;
  }

  private updateMaximizedState = () => {
    this.setState({ isMaximized: this.mainWindow.isMaximized() });
  }

  private stopDoubleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }

  private openMainMenu = () => {
    const menu = remote.Menu.getApplicationMenu();
    if (!menu || !this.menuButton) return;

    const rect = this.menuButton.getBoundingClientRect();
    menu.popup({
      window: remote.getCurrentWindow(),
      x: Math.round(rect.left),
      y: Math.round(rect.bottom),
    });
  }

  private goHome = () => {
    const { activeApplicationId, onGoHome } = this.props;
    if (activeApplicationId) onGoHome(activeApplicationId);
  }

  private minimizeWindow = () => this.mainWindow.minimize();

  private toggleMaximizeWindow = () => {
    if (this.mainWindow.isMaximized()) {
      this.mainWindow.unmaximize();
    } else {
      this.mainWindow.maximize();
    }
  }

  private closeWindow = () => this.mainWindow.close();

  private renderButton(
    name: IconName,
    label: string,
    onClick: () => void,
    options: { disabled?: boolean, active?: boolean, badge?: boolean, className?: string } = {},
  ) {
    const classNames = [
      'station-main-header__button',
      options.active ? 'station-main-header__button--active' : '',
      options.className || '',
    ].filter(Boolean).join(' ');

    return (
      <button
        aria-label={label}
        aria-pressed={options.active}
        className={classNames}
        disabled={options.disabled}
        onClick={onClick}
        onDoubleClick={this.stopDoubleClick}
        title={label}
        type="button"
      >
        <HeaderIcon name={name} />
        {options.badge && <span className="station-main-header__badge" />}
      </button>
    );
  }

  // tslint:disable-next-line:member-ordering
  render() {
    const {
      activeApplicationId,
      activeTabTitle,
      appStoreVisible,
      canGoBack,
      canGoForward,
      isLoading,
      notificationCenterVisible,
      notificationCount,
      notificationsSnoozed,
      onAddApplication,
      onDoubleClick,
      onGoBack,
      onGoForward,
      onReload,
      onToggleQuickSwitch,
      onToggleNotifications,
      quickSwitchVisible,
    } = this.props;

    return (
      <header className="station-main-header" onDoubleClick={onDoubleClick}>
        <div className="station-main-header__controls station-main-header__controls--left">
          <button
            aria-label="Main menu"
            className="station-main-header__button"
            onClick={this.openMainMenu}
            onDoubleClick={this.stopDoubleClick}
            ref={this.setMenuButtonRef}
            title="Main menu"
            type="button"
          >
            <HeaderIcon name="menu" />
          </button>
          {this.renderButton('plus', 'Add apps', onAddApplication, { active: appStoreVisible })}
          <span className="station-main-header__separator" />
          {this.renderButton('back', 'Go back', onGoBack, { disabled: !canGoBack })}
          {this.renderButton('forward', 'Go forward', onGoForward, { disabled: !canGoForward })}
          {this.renderButton('reload', 'Reload', onReload, {
            className: isLoading ? 'station-main-header__button--loading' : '',
            disabled: !activeApplicationId,
          })}
          {this.renderButton('home', 'Application home', this.goHome, { disabled: !activeApplicationId })}
        </div>

        <div className="station-main-header__title" title={activeTabTitle}>
          {activeTabTitle}
        </div>

        <div className="station-main-header__controls station-main-header__controls--right">
          {this.renderButton('search', 'Quick-Switch (Ctrl+T)', onToggleQuickSwitch, { active: quickSwitchVisible })}
          {this.renderButton('bell', notificationsSnoozed ? 'Notifications snoozed' : 'Notifications', onToggleNotifications, {
            active: notificationCenterVisible,
            badge: notificationCount > 0 && !notificationsSnoozed,
          })}
          <span className="station-main-header__separator station-main-header__separator--window" />
          {this.renderButton('minimize', 'Minimize window', this.minimizeWindow, {
            className: 'station-main-header__button--window',
          })}
          {this.renderButton(
            this.state.isMaximized ? 'restore' : 'maximize',
            this.state.isMaximized ? 'Restore window' : 'Maximize window',
            this.toggleMaximizeWindow,
            { className: 'station-main-header__button--window' },
          )}
          {this.renderButton('close', 'Close window', this.closeWindow, { className: 'station-main-header__button--close' })}
        </div>
      </header>
    );
  }
}

const getActiveTabTitle = (state: StationState): string => {
  const activeTabId = getFrontActiveTabId(state);
  if (!activeTabId) return 'Station';

  const tab = state.getIn(['tabs', activeTabId]);
  return tab ? (getTabTitle(tab) || 'Station') : 'Station';
};

const MainHeader = connect<StateProps, DispatchProps, OwnProps>(
  (state: StationState) => {
    const notifications = getNotifications(state);
    return {
      activeApplicationId: getActiveApplicationId(state),
      activeTabTitle: getActiveTabTitle(state),
      canGoBack: Boolean(getCurrentActiveTabProperty(state, 'canGoBack')),
      canGoForward: Boolean(getCurrentActiveTabProperty(state, 'canGoForward')),
      isLoading: Boolean(getCurrentActiveTabProperty(state, 'isLoading')),
      appStoreVisible: isAppStoreVisible(state),
      quickSwitchVisible: isQuickSwitchVisible(state),
      notificationCenterVisible: isNotificationCenterVisible(state),
      notificationCount: notifications ? notifications.size : 0,
      notificationsSnoozed: Boolean(getSnoozeDuration(state)),
    };
  },
  (dispatch: Dispatch) => bindActionCreators({
    onAddApplication: toggleAppStore,
    onToggleQuickSwitch: () => toggleQuickSwitch('center-modal', 'dedicated_button'),
    onGoBack: () => executeWebviewMethodForCurrentTab('go-back'),
    onGoForward: () => executeWebviewMethodForCurrentTab('go-forward'),
    onReload: () => executeWebviewMethodForCurrentTab('reload'),
    onGoHome: setHomeTabAsActive,
    onToggleNotifications: toggleNotificationCenter,
  }, dispatch),
)(MainHeaderImpl as any);

export default MainHeader as React.ComponentType<OwnProps>;
