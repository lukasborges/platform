import { Button, Size } from '@getstation/theme';
import ms = require('ms');
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';

import { settingsButtonStyle } from '../settingsButtonStyle';

import {
  withGetAutoUpdateStatus, withCheckForUpdatesMutation, withOpenReleaseNotesMutation, withQuitAndInstallMutation,
} from './queries@local.gql.generated';
export interface Classes {
  checking: string,
  info: string,
  updateButton: string,
}

export interface Props {
  classes?: Classes,
  isDownloadingUpdate: boolean,
  isCheckingUpdate: boolean,
  isUpdateAvailable: boolean,
  isUpdateDownloaded: boolean,
  downloadProgress: number | null,
  releaseName: string,
  checkForUpdates: () => any,
  openReleaseNotes: () => any,
  quitAndInstall: () => any,
}

export interface State {
  justCheckedForUpdate: boolean,
}

const styles = () => ({
  checking: {
    display: 'inline-block',
    position: 'relative',
    top: 2,
    width: 10,
    height: 10,
    marginRight: 5,
    borderRadius: '100%',
    backgroundColor: 'transparent',
    border: '2px solid var(--app-text-primary)',
    animation: '3s ease-in-out 0s infinite checking',
  },
  '@keyframes checking': {
    '0%': { transform: 'scale(0.8)' },
    '50%': { transform: 'scale(1.3)' },
    '100%': { transform: 'scale(0.8)' },
  },
  info: {
    marginTop: 5,
    fontSize: 11,
    color: 'var(--app-text-muted)',
    textAlign: 'center',
  },
  updateButton: {
    ...settingsButtonStyle,
    minWidth: '160px',
    marginTop: 2,
  },
});

@injectSheet(styles)
class SettingsUpdatesButton extends React.PureComponent<Props, State> {
  private resetFeedbackTimeout?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);

    this.state = {
      justCheckedForUpdate: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isCheckingUpdate && !this.props.isCheckingUpdate) {
      this.setState({ justCheckedForUpdate: true });

      if (this.resetFeedbackTimeout) clearTimeout(this.resetFeedbackTimeout);
      this.resetFeedbackTimeout = setTimeout(
        () => this.setState({ justCheckedForUpdate: false }),
        ms('1min')
      );
    }
  }

  componentWillUnmount() {
    if (this.resetFeedbackTimeout) clearTimeout(this.resetFeedbackTimeout);
  }

  render() {
    const { classes } = this.props;

    if (this.props.isCheckingUpdate) {
      return (
        <Button className={classes!.updateButton} btnSize={Size.SMALL} disabled={this.props.isCheckingUpdate}>
          <span className={classes!.checking} />
          Checking...
        </Button>
      );
    }

    if (this.props.isDownloadingUpdate) {
      const percent = typeof this.props.downloadProgress === 'number'
        ? Math.floor(this.props.downloadProgress)
        : 0;
      return (
        <div>
          <Button className={classes!.updateButton} btnSize={Size.SMALL} disabled={true}>
            Downloading... {percent}%
          </Button>

          <p className={classes!.info}>Downloading Platform {this.props.releaseName}</p>
        </div>
      );
    }

    if (this.props.isUpdateDownloaded) {
      return (
        <div>
          <Button className={classes!.updateButton} btnSize={Size.SMALL} onClick={this.props.quitAndInstall}>
            Restart to update
          </Button>

          <p className={classes!.info}>Platform {this.props.releaseName} is ready to install</p>
        </div>
      );
    }

    if (this.props.isUpdateAvailable) {
      return (
        <div>
          <Button className={classes!.updateButton} btnSize={Size.SMALL} onClick={this.props.openReleaseNotes}>
            View available downloads
          </Button>

          <p className={classes!.info}>New version available ({this.props.releaseName})</p>
        </div>
      );
    }

    if (!this.props.isUpdateAvailable && this.state.justCheckedForUpdate) {
      return (
        <div>
          <Button className={classes!.updateButton} btnSize={Size.SMALL} onClick={this.props.checkForUpdates}>
            No new updates
          </Button>

          <p className={classes!.info}>You have the most recent version</p>
        </div>

      );
    }

    return (
      <Button className={classes!.updateButton} btnSize={Size.SMALL} onClick={this.props.checkForUpdates}>
        Check for updates
      </Button>
    );
  }
}

const connect = compose(
  (withGetAutoUpdateStatus as any)({
    props: ({ data }: any) => ({
      isDownloadingUpdate: data && data.autoUpdateStatus && data.autoUpdateStatus.isDownloadingUpdate ?
        data.autoUpdateStatus.isDownloadingUpdate : false,
      isCheckingUpdate: data && data.autoUpdateStatus && data.autoUpdateStatus.isCheckingUpdate ?
        data.autoUpdateStatus.isCheckingUpdate : false,
      isUpdateAvailable: data && data.autoUpdateStatus && data.autoUpdateStatus.isUpdateAvailable ?
        data.autoUpdateStatus.isUpdateAvailable : false,
      isUpdateDownloaded: data && data.autoUpdateStatus && data.autoUpdateStatus.isUpdateDownloaded ?
        data.autoUpdateStatus.isUpdateDownloaded : false,
      downloadProgress: data && data.autoUpdateStatus && data.autoUpdateStatus.downloadProgress !== undefined ?
        data.autoUpdateStatus.downloadProgress : null,
      releaseName: data && data.autoUpdateStatus && data.autoUpdateStatus.releaseName ?
        data.autoUpdateStatus.releaseName : '',
    }),
  }),
  (withCheckForUpdatesMutation as any)({
    props: ({ mutate }: any) => ({
      checkForUpdates: () => mutate && mutate({ variables: { } }),
    }),
  }),
  (withOpenReleaseNotesMutation as any)({
    props: ({ mutate }: any) => ({
      openReleaseNotes: () => mutate && mutate({ variables: { } }),
    }),
  }),
  (withQuitAndInstallMutation as any)({
    props: ({ mutate }: any) => ({
      quitAndInstall: () => mutate && mutate({ variables: { } }),
    }),
  }),
);

export default connect(SettingsUpdatesButton as any) as React.ComponentType<{}>;
