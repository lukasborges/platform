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
import { executeWebviewMethodForCurrentTab } from '../tab-webcontents/duck';
import { getTabTitle } from '../tabs/get';
import { StationState } from '../types';
import { hasSystemTitleBar } from '../windows/systemTitleBar';

type IconName = 'menu' | 'plus' | 'search' | 'back' | 'forward' | 'reload' | 'home' |
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
  activeApplicationZoomLevel: number,
  activeTabTitle: string,
  canGoBack: boolean,
  canGoForward: boolean,
  isLoading: boolean,
  appStoreVisible: boolean,
  quickSwitchVisible: boolean,
}

interface DispatchProps {
  onAddApplication: () => void,
  onToggleQuickSwitch: () => void,
  onGoBack: () => void,
  onGoForward: () => void,
  onReload: () => void,
  onGoHome: (applicationId: string) => void,
}

interface OwnProps {
  onDoubleClick: () => void,
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  isMaximized: boolean,
  isMenuOpen: boolean,
}

interface HeaderMenuLevelProps {
  depth?: number,
  items: Electron.MenuItem[],
  menuRef?: (menu: HTMLDivElement | null) => void,
  onActivate: (item: Electron.MenuItem) => void,
  zoomPercentage: number,
}

interface HeaderMenuLevelState {
  activeSubmenu: number | null,
}

const formatMenuAccelerator = (accelerator: string): string => accelerator
  .replace(/CommandOrControl|CmdOrCtrl/g, process.platform === 'darwin' ? '⌘' : 'Ctrl')
  .replace(/Command|Cmd/g, process.platform === 'darwin' ? '⌘' : 'Super')
  .replace(/Control/g, 'Ctrl')
  .replace(/Option/g, process.platform === 'darwin' ? '⌥' : 'Alt');

const findMenuItem = (
  items: Electron.MenuItem[],
  predicate: (item: Electron.MenuItem) => boolean,
): Electron.MenuItem | undefined => {
  for (const item of items) {
    if (predicate(item)) return item;
    if (item.submenu) {
      const match = findMenuItem(item.submenu.items, predicate);
      if (match) return match;
    }
  }
  return undefined;
};

// The native application menu is organized as a desktop menubar. The header
// button follows GNOME's application-menu pattern instead: a short, flat list
// containing the actions that are useful from the shell itself.
const getHeaderMenuItems = (menu: Electron.Menu): Electron.MenuItem[] => {
  const items = menu.items;
  const byId = (id: string) => findMenuItem(items, item => item.id === id);
  const byLabel = (label: string) => findMenuItem(items, item => item.label === label);
  const separator = findMenuItem(items, item => item.type === 'separator');

  return [
    byId('find'),
    separator,
    byId('page-zoom-out'),
    byId('page-reset-zoom'),
    byId('page-zoom-in'),
    separator,
    byId('settings'),
    byId('toggle-kbd-shortcuts'),
    byLabel('Bugs && Features request'),
    byLabel('About Platform'),
  ].filter((item): item is Electron.MenuItem => Boolean(item));
};

const getHeaderMenuLabel = (item: Electron.MenuItem): string => {
  if (item.id === 'toggle-kbd-shortcuts') return 'Keyboard Shortcuts';
  if (item.label === 'Bugs && Features request') return 'Help';

  return item.label
    .replace(/&&/g, '\u0000')
    .replace(/&/g, '')
    .replace(/\u0000/g, '&');
};

class HeaderMenuLevel extends React.PureComponent<HeaderMenuLevelProps, HeaderMenuLevelState> {
  state: HeaderMenuLevelState = { activeSubmenu: null };

  render() {
    const { depth = 0, items, menuRef, onActivate, zoomPercentage } = this.props;

    return (
      <div className={`station-main-menu station-main-menu--depth-${depth}`} ref={menuRef} role="menu">
        {items.filter(item => item.visible).map((item, index) => {
          if (item.type === 'separator') {
            return <div className="station-main-menu__separator" key={`separator-${index}`} role="separator" />;
          }

          if (item.id === 'page-zoom-out') {
            const resetZoom = items[index + 1];
            const zoomIn = items[index + 2];

            return (
              <div className="station-main-menu__zoom" key="page-zoom" role="group" aria-label="Page zoom">
                <button
                  aria-label="Zoom out"
                  disabled={!item.enabled}
                  onClick={onActivate.bind(null, item)}
                  type="button"
                >
                  −
                </button>
                <button
                  aria-label="Reset zoom"
                  disabled={!resetZoom.enabled}
                  onClick={onActivate.bind(null, resetZoom)}
                  type="button"
                >
                  {zoomPercentage}%
                </button>
                <button
                  aria-label="Zoom in"
                  disabled={!zoomIn.enabled}
                  onClick={onActivate.bind(null, zoomIn)}
                  type="button"
                >
                  +
                </button>
              </div>
            );
          }

          if (item.id === 'page-reset-zoom' || item.id === 'page-zoom-in') return null;

          const hasSubmenu = Boolean(item.submenu);
          const submenuOpen = hasSubmenu && this.state.activeSubmenu === index;
          const label = getHeaderMenuLabel(item);

          return (
            <div
              className="station-main-menu__item-wrapper"
              key={item.id || `${label}-${index}`}
              onMouseEnter={() => this.openSubmenu(index, item)}
            >
              <button
                aria-haspopup={hasSubmenu ? 'menu' : undefined}
                aria-expanded={hasSubmenu ? submenuOpen : undefined}
                className="station-main-menu__item"
                disabled={!item.enabled}
                onClick={() => this.selectItem(item, index)}
                role="menuitem"
                type="button"
              >
                <span className="station-main-menu__check">
                  {(item.type === 'checkbox' || item.type === 'radio') && item.checked ? '✓' : ''}
                </span>
                <span className="station-main-menu__label">{label}</span>
                {item.accelerator &&
                  <span className="station-main-menu__accelerator">
                    {formatMenuAccelerator(item.accelerator)}
                  </span>
                }
                {hasSubmenu && <span className="station-main-menu__arrow">›</span>}
              </button>
              {submenuOpen && item.submenu &&
                <HeaderMenuLevel
                  depth={depth + 1}
                  items={item.submenu.items}
                  onActivate={onActivate}
                  zoomPercentage={zoomPercentage}
                />
              }
            </div>
          );
        })}
      </div>
    );
  }

  private openSubmenu = (index: number, item: Electron.MenuItem) => {
    this.setState({ activeSubmenu: item.submenu ? index : null });
  }

  private selectItem = (item: Electron.MenuItem, index: number) => {
    if (item.submenu) {
      this.setState({ activeSubmenu: this.state.activeSubmenu === index ? null : index });
      return;
    }
    this.props.onActivate(item);
  }
}

class MainHeaderImpl extends React.PureComponent<Props, State> {
  state: State = {
    isMaximized: remote.getCurrentWindow().isMaximized(),
    isMenuOpen: false,
  };

  private menuButton: HTMLButtonElement | null = null;

  private menuPopover: HTMLDivElement | null = null;

  private mainWindow = remote.getCurrentWindow();

  private useSystemTitleBar = hasSystemTitleBar();

  componentDidMount() {
    this.mainWindow.on('maximize', this.updateMaximizedState);
    this.mainWindow.on('unmaximize', this.updateMaximizedState);
  }

  componentWillUnmount() {
    this.mainWindow.removeListener('maximize', this.updateMaximizedState);
    this.mainWindow.removeListener('unmaximize', this.updateMaximizedState);
    document.removeEventListener('mousedown', this.handleDocumentMouseDown, true);
    document.removeEventListener('keydown', this.handleDocumentKeyDown, true);
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (prevState.isMenuOpen === this.state.isMenuOpen) return;

    if (this.state.isMenuOpen) {
      document.addEventListener('mousedown', this.handleDocumentMouseDown, true);
      document.addEventListener('keydown', this.handleDocumentKeyDown, true);
    } else {
      document.removeEventListener('mousedown', this.handleDocumentMouseDown, true);
      document.removeEventListener('keydown', this.handleDocumentKeyDown, true);
    }
  }

  private setMenuButtonRef = (button: HTMLButtonElement | null) => {
    this.menuButton = button;
  }

  private setMenuPopoverRef = (popover: HTMLDivElement | null) => {
    this.menuPopover = popover;
  }

  private updateMaximizedState = () => {
    this.setState({ isMaximized: this.mainWindow.isMaximized() });
  }

  private stopDoubleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }

  private handleDocumentMouseDown = (event: MouseEvent) => {
    const target = event.target as Node;
    if (this.menuButton?.contains(target) || this.menuPopover?.contains(target)) return;
    this.closeMainMenu();
  }

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.closeMainMenu();
  }

  private closeMainMenu = () => {
    this.setState({ isMenuOpen: false });
  }

  private toggleMainMenu = () => {
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));
  }

  private activateMenuItem = (item: Electron.MenuItem) => {
    // Zoom is an incremental control. Keep the popover open so users can
    // click more than once and see the current percentage immediately.
    if (!['page-zoom-out', 'page-reset-zoom', 'page-zoom-in'].includes(item.id)) {
      this.closeMainMenu();
    }
    item.click(item, this.mainWindow, {
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      triggeredByAccelerator: false,
    } as Electron.KeyboardEvent);
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
      activeApplicationZoomLevel,
      activeTabTitle,
      appStoreVisible,
      canGoBack,
      canGoForward,
      isLoading,
      onAddApplication,
      onDoubleClick,
      onGoBack,
      onGoForward,
      onReload,
      onToggleQuickSwitch,
      quickSwitchVisible,
    } = this.props;

    const applicationMenu = remote.Menu.getApplicationMenu();
    const headerMenuItems = applicationMenu ? getHeaderMenuItems(applicationMenu) : [];

    return (
      <header
        className={`station-main-header ${this.state.isMenuOpen ? 'station-main-header--menu-open' : ''}`}
        onDoubleClick={this.useSystemTitleBar ? undefined : onDoubleClick}
      >
        <div className="station-main-header__controls station-main-header__controls--left">
          <button
            aria-label="Main menu"
            aria-expanded={this.state.isMenuOpen}
            aria-haspopup="menu"
            className={`station-main-header__button ${this.state.isMenuOpen ? 'station-main-header__button--active' : ''}`}
            onClick={this.toggleMainMenu}
            onDoubleClick={this.stopDoubleClick}
            ref={this.setMenuButtonRef}
            title="Main menu"
            type="button"
          >
            <HeaderIcon name="menu" />
          </button>
          {this.state.isMenuOpen && headerMenuItems.length > 0 &&
            <HeaderMenuLevel
              items={headerMenuItems}
              menuRef={this.setMenuPopoverRef}
              onActivate={this.activateMenuItem}
              zoomPercentage={Math.round(100 * Math.pow(1.2, activeApplicationZoomLevel))}
            />
          }
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
          {!this.useSystemTitleBar && <>
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
          </>}
        </div>
      </header>
    );
  }
}

const getActiveTabTitle = (state: StationState): string => {
  const activeTabId = getFrontActiveTabId(state);
  if (!activeTabId) return 'Platform';

  const tab = state.getIn(['tabs', activeTabId]);
  return tab ? (getTabTitle(tab) || 'Platform') : 'Platform';
};

const MainHeader = connect<StateProps, DispatchProps, OwnProps>(
  (state: StationState) => {
    const activeApplicationId = getActiveApplicationId(state);

    return {
      activeApplicationId,
      activeApplicationZoomLevel: activeApplicationId ?
        Number(state.getIn(['applications', activeApplicationId, 'zoomLevel'], 0)) : 0,
      activeTabTitle: getActiveTabTitle(state),
      canGoBack: Boolean(getCurrentActiveTabProperty(state, 'canGoBack')),
      canGoForward: Boolean(getCurrentActiveTabProperty(state, 'canGoForward')),
      isLoading: Boolean(getCurrentActiveTabProperty(state, 'isLoading')),
      appStoreVisible: isAppStoreVisible(state),
      quickSwitchVisible: isQuickSwitchVisible(state),
    };
  },
  (dispatch: Dispatch) => bindActionCreators({
    onAddApplication: toggleAppStore,
    onToggleQuickSwitch: () => toggleQuickSwitch('center-modal', 'dedicated_button'),
    onGoBack: () => executeWebviewMethodForCurrentTab('go-back'),
    onGoForward: () => executeWebviewMethodForCurrentTab('go-forward'),
    onReload: () => executeWebviewMethodForCurrentTab('reload'),
    onGoHome: setHomeTabAsActive,
  }, dispatch),
)(MainHeaderImpl as any);

export default MainHeader as React.ComponentType<OwnProps>;
