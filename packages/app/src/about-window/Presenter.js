import * as remote from '@electron/remote';
import PropTypes from 'prop-types';
import React from 'react';
import injectSheet from 'react-jss';
import { hasSystemTitleBar } from '../windows/systemTitleBar';

const platformAppIcon = require('../static/logos/platform-app-icon.svg');

const styles = () => ({
  container: {
    WebkitAppRegion: 'drag',
    background: 'var(--app-surface)',
    border: '1px solid var(--app-border-strong)',
    borderRadius: 16,
    boxSizing: 'border-box',
    color: 'var(--app-text-primary)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    WebkitAppRegion: 'no-drag',
    alignItems: 'center',
    background: 'var(--app-active)',
    border: 0,
    borderRadius: '50%',
    color: 'var(--app-text-primary)',
    cursor: 'default',
    display: 'flex',
    fontSize: 20,
    fontWeight: 500,
    height: 26,
    justifyContent: 'center',
    lineHeight: 1,
    outline: 0,
    padding: 0,
    position: 'absolute',
    right: 12,
    top: 12,
    width: 26,
    zIndex: 2,
    '&:hover': { background: 'var(--app-pressed)' },
  },
  content: {
    WebkitAppRegion: 'no-drag',
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    padding: '46px 12px 18px',
  },
  appIcon: {
    height: 112,
    marginBottom: 12,
    width: 112,
  },
  title: {
    fontSize: 28,
    fontWeight: 750,
    letterSpacing: '-.02em',
    lineHeight: 1.15,
    margin: 0,
    textAlign: 'center',
  },
  subtitle: {
    color: 'var(--app-text-secondary)',
    fontSize: 15,
    margin: '6px 0 10px',
    textAlign: 'center',
  },
  version: {
    background: 'color-mix(in srgb, var(--app-accent) 12%, transparent)',
    borderRadius: 999,
    color: 'var(--app-accent)',
    fontSize: 15,
    fontWeight: 700,
    lineHeight: '30px',
    marginBottom: 22,
    minWidth: 70,
    padding: '0 12px',
    textAlign: 'center',
  },
  card: {
    background: 'var(--app-surface-elevated)',
    border: '1px solid var(--app-border)',
    borderRadius: 12,
    boxShadow: '0 1px 3px var(--app-shadow-soft)',
    boxSizing: 'border-box',
    marginBottom: 12,
    overflow: 'hidden',
    width: '100%',
  },
  row: {
    alignItems: 'center',
    boxSizing: 'border-box',
    color: 'var(--app-text-primary)',
    display: 'flex',
    fontSize: 15,
    justifyContent: 'space-between',
    minHeight: 54,
    padding: '0 14px',
    textDecoration: 'none',
    '&:hover': { background: 'var(--app-hover)' },
    '& + $row': { borderTop: '1px solid var(--app-border-subtle)' },
  },
  icon: {
    color: 'var(--app-icon)',
    fontSize: 21,
    fontWeight: 600,
    lineHeight: 1,
  },
  details: {
    borderTop: '1px solid var(--app-border-subtle)',
    '&:first-child': { borderTop: 0 },
    '&[open] $chevron': { transform: 'rotate(90deg)' },
  },
  summary: {
    listStyle: 'none',
    '&::-webkit-details-marker': { display: 'none' },
  },
  chevron: {
    transition: 'transform 120ms ease-out',
  },
  detailsContent: {
    color: 'var(--app-text-secondary)',
    fontSize: 13,
    lineHeight: 1.45,
    margin: 0,
    padding: '0 14px 14px',
  },
  footer: {
    color: 'var(--app-text-muted)',
    fontSize: 12,
    margin: '2px 0 0',
    textAlign: 'center',
  },
});

@injectSheet(styles)
class AboutWindowPresenter extends React.PureComponent {
  static propTypes = {
    appName: PropTypes.string,
    appVersion: PropTypes.string,
    classes: PropTypes.object.isRequired,
  };

  close = () => remote.getCurrentWindow().close();

  render() {
    const { appName = 'Platform', appVersion = '0.0', classes } = this.props;

    return (
      <main className={classes.container}>
        {!hasSystemTitleBar() && <button aria-label="Close" className={classes.closeButton} onClick={this.close} type="button">
          ×
        </button>}

        <div className={classes.content}>
          <img alt="" className={classes.appIcon} src={platformAppIcon} />
          <h1 className={classes.title}>{appName}</h1>
          <p className={classes.subtitle}>Community-maintained workspace</p>
          <div className={classes.version}>{appVersion}</div>

          <section className={classes.card}>
            <a className={classes.row} href="https://github.com/lukasborges/platform" rel="noreferrer" target="_blank">
              <span>Website</span>
              <span aria-hidden="true" className={classes.icon}>↗</span>
            </a>
            <a className={classes.row} href="https://github.com/lukasborges/platform/issues" rel="noreferrer" target="_blank">
              <span>Report an Issue</span>
              <span aria-hidden="true" className={classes.icon}>↗</span>
            </a>
          </section>

          <section className={classes.card}>
            <details className={classes.details}>
              <summary className={`${classes.row} ${classes.summary}`}>
                <span>Credits</span>
                <span aria-hidden="true" className={`${classes.icon} ${classes.chevron}`}>›</span>
              </summary>
              <p className={classes.detailsContent}>
                Built by the Platform community on the foundations created by the Station contributors.
              </p>
            </details>
            <details className={classes.details}>
              <summary className={`${classes.row} ${classes.summary}`}>
                <span>Legal</span>
                <span aria-hidden="true" className={`${classes.icon} ${classes.chevron}`}>›</span>
              </summary>
              <p className={classes.detailsContent}>
                Platform is open-source software distributed under the MIT License.
              </p>
            </details>
          </section>

          <p className={classes.footer}>2019–{new Date().getFullYear()} Platform contributors</p>
        </div>
      </main>
    );
  }
}

export default AboutWindowPresenter;
