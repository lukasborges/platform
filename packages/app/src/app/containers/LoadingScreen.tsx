import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { StationState } from '../../types';
import { isLoadingScreenVisible } from '../selectors';

const announcementHTML = require('!!raw-loader!../../app/resources/announcement.html').default;

interface StateProps {
  visible: boolean
}

interface JSSProps {
  classes: {
    container: string
    container2: string,
    cartouche: string,
    mark: string,
    brand: string,
    salutations: string,
    announcement: string,
    progress: string,
    progressBar: string,
  },
}

@injectSheet({
  container: {
    position: 'fixed',
    top: 54,
    bottom: 0,
    left: 68,
    right: 0,
    zIndex: 100,
    backgroundColor: '#16171a',
    borderLeft: '1px solid rgba(255, 255, 255, .08)',
    padding: 24,
  },
  container2: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'white',
    textAlign: 'center',
  },
  cartouche: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 22,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: '#2b2c31',
    border: '1px solid rgba(255, 255, 255, .1)',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0, 0, 0, .24)',
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    marginBottom: 14,
    width: 48,
    '&::before': {
      border: '2px solid rgba(255, 255, 255, .22)',
      borderRadius: '50%',
      content: '""',
      height: 16,
      position: 'absolute',
      top: 11,
      width: 16,
    },
    '&::after': {
      backgroundColor: 'rgba(255, 255, 255, .22)',
      borderRadius: 2,
      bottom: 10,
      content: '""',
      height: 2,
      position: 'absolute',
      width: 19,
    },
    position: 'relative',
  },
  brand: {
    color: 'rgba(255, 255, 255, .94)',
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '.01em',
  },
  salutations: {
    color: 'rgba(255, 255, 255, .58)',
    fontSize: 13,
    marginBottom: 18,
    '& p': {
      margin: 0,
    },
  },
  announcement: {
    color: 'rgba(255, 255, 255, .58)',
    fontSize: 13,
    maxWidth: '420px',
  },
  progress: {
    backgroundColor: 'rgba(255, 255, 255, .1)',
    borderRadius: 999,
    height: 3,
    overflow: 'hidden',
    position: 'relative',
    width: 120,
  },
  progressBar: {
    animation: 'stationLoading 1.25s ease-in-out infinite',
    backgroundColor: '#62a0ea',
    borderRadius: 999,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '42%',
  },
  '@keyframes stationLoading': {
    '0%': { transform: 'translateX(-110%)' },
    '50%': { transform: 'translateX(80%)' },
    '100%': { transform: 'translateX(245%)' },
  },
  '@global': {
    '.fade-exit': {
      opacity: 1,
    },
    '.fade-exit.fade-exit-active': {
      opacity: 0.01,
      transition: 'opacity 100ms ease-in',
    },
  },
})
class LoadingScreenImpl extends React.PureComponent<StateProps & JSSProps, {}> {

  render() {
    const { visible } = this.props;
    return (
      <CSSTransition
        in={visible}
        classNames="fade"
        unmountOnExit={true}
        timeout={{ exit: 100 }}
        enter={false}
      >
        {this.renderContent()}
      </CSSTransition>
    );
  }

  renderContent() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.container2}>
          <div className={classes.cartouche}>
            <div className={classes.mark} aria-hidden="true" />
            <div className={classes.brand}>Platform</div>
          </div>
          <div className={classes.salutations}>
            <p>
              Preparing your workspace…
            </p>
          </div>
          <div className={classes.progress} role="progressbar" aria-label="Loading Platform">
            <div className={classes.progressBar} />
          </div>
          <div className={classes.announcement} dangerouslySetInnerHTML={{ __html: announcementHTML }}/>
        </div>
      </div>
    );
  }
}

export default connect<StateProps, {}, {}>(
  (state: StationState) => ({
    visible: isLoadingScreenVisible(state) as boolean,
  }),
)(LoadingScreenImpl);
