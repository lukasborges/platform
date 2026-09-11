import { GradientType, withGradient } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import { MinimalApplication } from '../applications/graphql/withApplications';
import TrafficLights from '../dock/components/TrafficLights';
import { hasSystemTitleBar } from '../windows/systemTitleBar';

import OnboardingStepAppStore from './components/OnboardingStepAppStore';
import {
  InstallApplicationMutationVariables,
  Platform,
} from './queries@local.gql.generated';
import { resolveWebpackAsset } from '../../manifests/webpackAsset';

const platformAppIcon = resolveWebpackAsset(require('../static/logos/platform-app-icon.svg'));

export interface Classes {
  container: string,
  headerBar: string,
  headerTitle: string,
  headerActions: string,
  headerSubmit: string,
  headerWindowControls: string,
  windowButton: string,
  minimizeGlyph: string,
  maximizeGlyph: string,
  closeGlyph: string,
  trafficLights: string,
  content: string,
  welcome: string,
  appIcon: string,
  welcomeTitle: string,
  welcomeDescription: string,
  getStartedButton: string,
  welcomeNote: string,
  backButton: string,
  backButtonDarwin: string,
  backGlyph: string,
}

type InstallApplicationInput = InstallApplicationMutationVariables['input'];

export interface Props {
  classes?: Classes,
  applications: MinimalApplication[],
  themeGradient: string,
  error?: string,
  showWelcomeBack?: boolean,
  firstName?: string,
  step: number,
  emails: string[],
  loginButtonDisabled?: boolean,
  onClickLogin: () => any,
  onAppStoreStepFinished: (appsSelectedCount: number) => void,
  onEmailsChange: (emails: string[]) => any,
  isWindowFocused: boolean,
  onCloseWindow: () => any,
  onMinimizeWindow: () => any,
  onExpandWindow: () => any,
  isDarwin: boolean,
  validateEmail: (email: string) => boolean,
  searchInputValue: string,
  handleSearchInputValue: (value: string) => any,
  installApplication: (input: InstallApplicationInput) => Promise<void>,
  onboardingDone: (nbInstalledApps: number, onboardeeId: string | undefined) => Promise<void>,
}

interface State {
  selectedApplications: (MinimalApplication & { position?: DOMRect })[],
  isLoading: boolean,
  page: 'welcome' | 'apps',
  setupError?: string,
}

const withTimeout = <T extends unknown>(promise: Promise<T>, timeout: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => reject(new Error('The setup operation timed out.')), timeout);
    }),
  ]);

const interactiveButton = {
  WebkitAppRegion: 'no-drag',
  alignItems: 'center',
  border: 0,
  cursor: 'pointer',
  display: 'flex',
  fontFamily: 'inherit',
  justifyContent: 'center',
  outline: 0,
} as any;

const styles = () => ({
  container: {
    background: 'var(--app-surface)',
    color: 'var(--app-text-primary)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 101,
  },
  headerBar: {
    WebkitAppRegion: 'drag',
    alignItems: 'center',
    background: 'var(--app-surface-raised)',
    borderBottom: '1px solid var(--app-border-subtle)',
    display: 'flex',
    flex: '0 0 52px',
    justifyContent: 'center',
    minHeight: 52,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '.01em',
  },
  headerActions: {
    alignItems: 'center',
    display: 'flex',
    position: 'absolute',
    right: 10,
  },
  headerSubmit: {
    ...interactiveButton,
    background: 'var(--app-accent)',
    border: '1px solid color-mix(in srgb, var(--app-accent) 82%, #000)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    height: 34,
    padding: '0 14px',
    transition: 'filter 120ms ease, opacity 120ms ease, box-shadow 120ms ease',
    '&:hover:not(:disabled)': {
      filter: 'brightness(1.08)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--app-accent) 35%, transparent)',
    },
    '&:disabled': {
      cursor: 'default',
      opacity: .45,
    },
  },
  headerWindowControls: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: 12,
    '& $windowButton + $windowButton': {
      marginLeft: 8,
    },
  },
  windowButton: {
    ...interactiveButton,
    background: 'var(--app-surface-subtle)',
    borderRadius: '50%',
    color: 'var(--app-text-primary)',
    height: 32,
    padding: 0,
    transition: 'background 120ms ease',
    width: 32,
    '&:hover': {
      background: 'var(--app-active)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--app-accent)',
    },
  },
  minimizeGlyph: {
    background: 'currentColor',
    height: 1,
    width: 11,
  },
  maximizeGlyph: {
    border: '1.5px solid currentColor',
    boxSizing: 'border-box',
    height: 10,
    width: 10,
  },
  closeGlyph: {
    height: 12,
    position: 'relative',
    width: 12,
    '&::before, &::after': {
      background: 'currentColor',
      content: '""',
      height: 1.5,
      left: 0,
      position: 'absolute',
      top: 5,
      width: 12,
    },
    '&::before': {
      transform: 'rotate(45deg)',
    },
    '&::after': {
      transform: 'rotate(-45deg)',
    },
  },
  trafficLights: {
    WebkitAppRegion: 'no-drag',
    left: 8,
    position: 'absolute',
    top: 13,
  },
  content: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  welcome: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px 28px 88px',
    textAlign: 'center',
  },
  appIcon: {
    filter: 'drop-shadow(0 8px 18px var(--app-shadow-soft))',
    height: 144,
    marginBottom: 34,
    width: 144,
  },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: 750,
    letterSpacing: '-.025em',
    lineHeight: 1.15,
    margin: '0 0 18px',
  },
  welcomeDescription: {
    color: 'var(--app-text-secondary)',
    fontSize: 17,
    lineHeight: 1.5,
    margin: '0 0 30px',
    maxWidth: 440,
  },
  getStartedButton: {
    ...interactiveButton,
    background: 'var(--app-accent)',
    borderRadius: 999,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    minHeight: 44,
    minWidth: 150,
    padding: '0 26px',
    transition: 'filter 120ms ease, box-shadow 120ms ease',
    '&:hover': {
      filter: 'brightness(1.08)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--app-accent) 35%, transparent)',
    },
  },
  welcomeNote: {
    color: 'var(--app-text-muted)',
    fontSize: 13,
    margin: '18px 0 0',
  },
  backButton: {
    ...interactiveButton,
    background: 'var(--app-surface-subtle)',
    borderRadius: 9,
    color: 'var(--app-text-primary)',
    height: 34,
    left: 10,
    padding: 0,
    position: 'absolute',
    transition: 'background 120ms ease',
    width: 38,
    '&:hover': {
      background: 'var(--app-active)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--app-accent)',
    },
  },
  backButtonDarwin: {
    left: 72,
  },
  backGlyph: {
    borderBottom: '2px solid currentColor',
    borderLeft: '2px solid currentColor',
    height: 8,
    transform: 'rotate(45deg)',
    width: 8,
  },
});

@injectSheet(styles)
class Presenter extends React.PureComponent<Props, State> {
  state: State = {
    selectedApplications: [],
    isLoading: false,
    page: 'welcome',
    setupError: undefined,
  };

  handleApplicationSelect = (application: MinimalApplication) => {
    const { selectedApplications } = this.state;
    const selected = selectedApplications.find(app => app.id === application.id);

    if (selected) {
      this.setState({
        selectedApplications: selectedApplications.filter(app => app.id !== application.id),
      });
      return;
    }

    if (selectedApplications.length >= 15) return;

    this.setState({
      selectedApplications: [...selectedApplications, application],
    });
  }

  handleSubmitAppStore = async () => {
    const { installApplication, onboardingDone } = this.props;
    if (this.state.isLoading) return;

    this.setState({ isLoading: true, setupError: undefined });

    const apps = this.state.selectedApplications.map(application => ({
      id: undefined,
      application,
      configuration: {},
    }));

    try {
      for (const app of apps) {
        await withTimeout(installApplication({
          manifestURL: app.application.bxAppManifestURL,
          context: {
            id: app.application.id,
            platform: Platform.PlatformAppstore,
            onboardeeApplicationAssignment: undefined,
          },
          configuration: app.configuration,
        }), 15000);
      }

      await withTimeout(onboardingDone(apps.length, undefined), 10000);
    } catch {
      this.setState({
        isLoading: false,
        setupError: 'Setup could not be completed. Check your connection and try again.',
      });
    }
  }

  showWelcome = () => {
    this.setState({ page: 'welcome' });
  }

  showAppPicker = () => {
    this.setState({ page: 'apps' });
  }

  renderHeader() {
    const {
      classes, isDarwin, isWindowFocused, onCloseWindow, onMinimizeWindow, onExpandWindow,
    } = this.props;
    const { isLoading, page, selectedApplications } = this.state;

    return (
      <header className={classes!.headerBar}>
        {isDarwin && !hasSystemTitleBar() &&
          <div className={classes!.trafficLights}>
            <TrafficLights
              focused={isWindowFocused}
              handleClose={onCloseWindow}
              handleMinimize={onMinimizeWindow}
              handleExpand={onExpandWindow}
              allHover={true}
            />
          </div>
        }
        {page === 'apps' &&
          <button
            type="button"
            className={`${classes!.backButton}${isDarwin && !hasSystemTitleBar() ? ` ${classes!.backButtonDarwin}` : ''}`}
            aria-label="Back to welcome"
            onClick={this.showWelcome}
          >
            <span className={classes!.backGlyph} aria-hidden="true" />
          </button>
        }
        <span className={classes!.headerTitle}>Platform</span>
        <div className={classes!.headerActions}>
          {page === 'apps' &&
            <button
              type="button"
              className={classes!.headerSubmit}
              disabled={selectedApplications.length < 3 || isLoading}
              onClick={this.handleSubmitAppStore}
            >
              {isLoading ? 'Setting up…' : 'Start Platform'}
            </button>
          }
          {!isDarwin && !hasSystemTitleBar() &&
            <div className={classes!.headerWindowControls}>
              <button type="button" className={classes!.windowButton} aria-label="Minimize" onClick={onMinimizeWindow}>
                <span className={classes!.minimizeGlyph} aria-hidden="true" />
              </button>
              <button type="button" className={classes!.windowButton} aria-label="Maximize" onClick={onExpandWindow}>
                <span className={classes!.maximizeGlyph} aria-hidden="true" />
              </button>
              <button type="button" className={classes!.windowButton} aria-label="Close" onClick={onCloseWindow}>
                <span className={classes!.closeGlyph} aria-hidden="true" />
              </button>
            </div>
          }
        </div>
      </header>
    );
  }

  renderWelcome() {
    const { classes } = this.props;

    return (
      <main className={classes!.welcome}>
        <img className={classes!.appIcon} src={platformAppIcon} alt="" aria-hidden="true" />
        <h1 className={classes!.welcomeTitle}>Welcome to Platform</h1>
        <p className={classes!.welcomeDescription}>
          Bring your web apps together in one place.<br />
          Let’s set up the apps you use most.
        </p>
        <button
          type="button"
          className={classes!.getStartedButton}
          onClick={this.showAppPicker}
        >
          Get Started
        </button>
        <p className={classes!.welcomeNote}>You can add or remove apps at any time.</p>
      </main>
    );
  }

  render() {
    const {
      classes, applications, searchInputValue, handleSearchInputValue,
    } = this.props;
    const { selectedApplications, page, setupError } = this.state;

    return (
      <div className={classes!.container}>
        <div id="portal-powered-by-platform" />
        {this.renderHeader()}
        <div className={classes!.content}>
          {page === 'welcome'
            ? this.renderWelcome()
            : (
              <OnboardingStepAppStore
                onHandleApplicationSelect={this.handleApplicationSelect}
                applications={applications.slice(0, 10)}
                selectedApplications={selectedApplications}
                searchInputValue={searchInputValue}
                handleSearchInputValue={handleSearchInputValue}
                setupError={setupError}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default withGradient(GradientType.normal)(Presenter);
