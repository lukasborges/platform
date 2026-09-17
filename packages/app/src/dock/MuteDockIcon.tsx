import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import NativeAppDockIcon, { IconSymbol } from './components/NativeAppDockIcon';
import { INFINITE } from '../notification-center/constants';
import { resetSnoozeDuration, setSnoozeDuration } from '../notification-center/duck';
import { getSnoozeState } from '../notification-center/selectors';
import { StationState } from '../types';

interface StateToProps {
  isSnoozed: boolean,
}

interface DispatchToProps {
  onEnable: () => void,
  onDisable: () => void,
}

const MuteDockIconImpl: React.ComponentType<StateToProps & DispatchToProps> = ({ isSnoozed, onEnable, onDisable }) => (
  <NativeAppDockIcon
    iconSymbolId={isSnoozed ? IconSymbol.BELL_OFF : IconSymbol.BELL}
    onClick={isSnoozed ? onDisable : onEnable}
    active={isSnoozed}
    tooltip={isSnoozed ? 'Notifications silenced' : 'Notifications on'}
  />
);

const MuteDockIcon = connect<StateToProps, DispatchToProps, {}, StationState>(
  (state) => ({
    isSnoozed: getSnoozeState(state),
  }),
  (dispatch) => bindActionCreators({
    onEnable: () => setSnoozeDuration('dock-toggle', INFINITE),
    onDisable: () => resetSnoozeDuration('dock-toggle'),
  }, dispatch)
)(MuteDockIconImpl);

export default MuteDockIcon;
