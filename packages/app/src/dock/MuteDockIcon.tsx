import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { INFINITE } from '../notification-center/constants';
import { resetSnoozeDuration, setSnoozeDuration } from '../notification-center/duck';
import { getSnoozeState } from '../notification-center/selectors';
import { StationState } from '../types';

export interface Classes {
  container: string,
  dockIcon: string,
}

export interface Props {
  classes?: Classes,
  isSnoozed: boolean,
  toggleSnooze: (enabled: boolean) => void,
}

const styles = () => ({
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dockIcon: {
    height: 40,
    width: 40,
    borderRadius: 8,
    transition: 'background-color 120ms ease',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--app-text-secondary)',
    '&:hover': {
      backgroundColor: 'var(--app-hover)',
      color: 'var(--app-text-primary)',
    },
    '&[data-active="true"]': {
      backgroundColor: 'var(--app-active)',
      color: 'var(--app-text-primary)',
    },
  },
});

@injectSheet(styles)
class MuteDockIconImpl extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.toggleSnooze(!this.props.isSnoozed);
  }

  render() {
    const { classes, isSnoozed } = this.props;
    return (
      <div className={classes!.container}>
        <button
          type="button"
          className={classes!.dockIcon}
          data-active={isSnoozed}
          aria-label={isSnoozed ? 'Disable Do Not Disturb' : 'Enable Do Not Disturb'}
          title={isSnoozed ? 'Notifications are silenced' : 'Notifications are on'}
          onClick={this.handleClick}
        >
          <MuteIcon isSnoozed={isSnoozed} />
        </button>
      </div>
    );
  }
}

const MuteIcon = ({ isSnoozed }: { isSnoozed: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {isSnoozed ? (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </>
    ) : (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    )}
  </svg>
);

const MuteDockIcon = connect(
  (state: StationState) => ({
    isSnoozed: getSnoozeState(state),
  }),
  (dispatch: Dispatch<any>) => bindActionCreators(
    {
      toggleSnooze: (enabled: boolean) => enabled
        ? setSnoozeDuration('dock-toggle', '1hour')
        : resetSnoozeDuration('dock-toggle'),
    },
    dispatch
  )
)(MuteDockIconImpl);

export default MuteDockIcon;
