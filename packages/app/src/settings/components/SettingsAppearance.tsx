import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import {
  AppearanceTheme,
  getAppearanceTheme,
  setAppearanceTheme,
} from '../../theme/appearance';
import { getUseSystemTitleBar, hasSystemTitleBar, setUseSystemTitleBar } from '../../windows/systemTitleBar';
import AdwaitaSwitch from './AdwaitaSwitch';

interface Classes {
  container: string,
  description: string,
  options: string,
  option: string,
  optionActive: string,
  preview: string,
  previewBack: string,
  previewFront: string,
  previewLight: string,
  previewDark: string,
  previewSystem: string,
  settingName: string,
  titleBarSetting: string,
}

interface Props {
  classes?: Classes,
}

interface State {
  theme: AppearanceTheme,
  useSystemTitleBar: boolean,
  titleBarError: boolean,
}

const options: { value: AppearanceTheme, label: string }[] = [
  { value: 'light', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const styles = {
  titleBarSetting: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
  },
  container: {
    maxWidth: 600,
    padding: [18, 0, 22],
  },
  settingName: {
    marginBottom: 4,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    color: 'var(--settings-muted-text)',
    fontSize: 13,
    marginBottom: 14,
  },
  options: {
    background: 'var(--app-surface-raised)',
    border: '1px solid var(--settings-border)',
    borderRadius: 12,
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    padding: 16,
  },
  option: {
    appearance: 'none',
    background: 'transparent',
    border: 0,
    borderRadius: 10,
    color: 'inherit',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: 14,
    padding: [3, 3, 1],
    textAlign: 'center',
    '&:hover': {
      background: 'var(--settings-option-background)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--settings-focus-ring)',
      outline: 'none',
    },
  },
  optionActive: {
    '& $preview': {
      borderColor: 'var(--settings-accent)',
      boxShadow: '0 0 0 2px var(--settings-accent)',
    },
  },
  preview: {
    background: 'linear-gradient(135deg, #071c63 0%, #0646db 48%, #101766 100%)',
    border: '1px solid transparent',
    borderRadius: 8,
    display: 'block',
    height: 104,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
    '&:before': {
      background: 'rgba(0, 102, 255, .55)',
      borderRadius: '48% 52% 42% 58%',
      content: '""',
      height: 92,
      left: 18,
      position: 'absolute',
      top: 5,
      transform: 'rotate(30deg)',
      width: 112,
    },
    '&:after': {
      background: 'rgba(28, 83, 214, .5)',
      borderRadius: '50%',
      content: '""',
      height: 76,
      right: 6,
      position: 'absolute',
      top: 14,
      width: 76,
    },
  },
  previewBack: {
    background: '#202124',
    borderRadius: 6,
    boxShadow: '0 6px 14px rgba(0, 0, 0, .28)',
    height: 58,
    left: '38%',
    position: 'absolute',
    top: 17,
    width: '52%',
    zIndex: 1,
  },
  previewFront: {
    background: '#f7f7f8',
    borderRadius: 6,
    boxShadow: '0 6px 14px rgba(0, 0, 0, .28)',
    height: 54,
    left: '14%',
    position: 'absolute',
    top: 39,
    width: '52%',
    zIndex: 2,
    '&:before': {
      background: 'rgba(0, 0, 0, .08)',
      borderRadius: [6, 6, 0, 0],
      content: '""',
      height: 13,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  },
  previewLight: {
    '& $previewBack': {
      background: '#202124',
    },
  },
  previewDark: {
    '& $previewFront': {
      background: '#242527',
    },
    '& $previewFront:before': {
      background: 'rgba(255, 255, 255, .08)',
    },
  },
  previewSystem: {
    '& $previewFront': {
      background: 'linear-gradient(135deg, #f7f7f8 0%, #f7f7f8 49%, #242527 51%, #242527 100%)',
    },
  },
};

@injectSheet(styles)
export default class SettingsAppearance extends React.PureComponent<Props, State> {
  state: State = {
    theme: getAppearanceTheme(),
    useSystemTitleBar: getUseSystemTitleBar(),
    titleBarError: false,
  };

  setTheme = (theme: AppearanceTheme) => {
    setAppearanceTheme(theme);
    this.setState({ theme });
  }

  handleThemeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setTheme(event.currentTarget.dataset.themeValue as AppearanceTheme);
  }

  handleTitleBarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const useSystemTitleBar = event.currentTarget.checked;
    try {
      setUseSystemTitleBar(useSystemTitleBar);
      this.setState({ useSystemTitleBar, titleBarError: false });
    } catch (_error) {
      this.setState({ titleBarError: true });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <section className={classes!.container} aria-labelledby="appearance-setting-title">
        <p id="appearance-setting-title" className={classes!.settingName}>Appearance</p>
        <p className={classes!.description}>Choose a theme or follow your system settings.</p>
        <div className={classes!.options} role="radiogroup" aria-label="Appearance theme">
          {options.map(option => {
            const selected = this.state.theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                data-theme-value={option.value}
                className={`${classes!.option} ${selected ? classes!.optionActive : ''}`}
                onClick={this.handleThemeClick}
              >
                <span className={`${classes!.preview} ${classes![`preview${option.value.charAt(0).toUpperCase()}${option.value.slice(1)}` as keyof Classes]}`}>
                  <span className={classes!.previewBack} />
                  <span className={classes!.previewFront} />
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
        <div className={classes!.titleBarSetting}>
          <span>Use system title bar</span>
          <AdwaitaSwitch
            checked={this.state.useSystemTitleBar}
            label="Use system title bar"
            onChange={this.handleTitleBarChange}
          />
        </div>
        <p className={classes!.description}>
          Use your desktop's window borders and controls. Applies after restarting Platform.
        </p>
        {this.state.useSystemTitleBar !== hasSystemTitleBar() &&
          <p className={classes!.description} role="status">Restart Platform to apply this change.</p>
        }
        {this.state.titleBarError &&
          <p role="alert">Could not save this preference. Please try again.</p>
        }
      </section>
    );
  }
}
