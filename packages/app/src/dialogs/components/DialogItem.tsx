import { Button, Icon, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore : no declaration file
import injectSheet from 'react-jss';
import { compose } from 'react-apollo';
import * as shortid from 'shortid';
import { oc } from 'ts-optchain';
import { getApplicationIconURL, getApplicationId } from '../../applications/get';
import { withGetApplication } from '../queries@local.gql.generated';
import { getDialogActions, getDialogApplication, getDialogMessage, getDialogTitle } from '../get';
import { DialogItemAction, ExtendedDialogItem, ExtendedDialogItemImmutable } from '../types';

export interface Classes {
  container: string,
  icon: string,
  content: string,
  title: string,
  dialogMessage: string,
  buttonWrapper: string,
  buttonContainer: string,
  button: string,
  buttonText: string,
}

export interface OwnProps {
  applicationName: string,
}

export interface StateProps {
  classes?: Classes,
  dialog: ExtendedDialogItemImmutable,
  onClickDialog: (dialog: ExtendedDialogItem, buttonClicked: DialogItemAction) => void,
  themeColor: string,
}

export type Props = OwnProps & StateProps;

const actionCTAOnBottom = (props: Props) =>
  props.dialog.get('actions').some((action) => Boolean(action!.get('text')));

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: (props: Props) => actionCTAOnBottom(props) ? 'wrap' : 'inherited',
    position: 'absolute',
    bottom: 20,
    left: 'calc(50% + 34px)',
    transform: 'translateX(-50%)',
    width: (props: Props) => actionCTAOnBottom(props) ? 400 : 300,
    margin: 0,
    padding: 18,
    color: 'white',
    backgroundColor: '#25262a',
    border: '1px solid rgba(255, 255, 255, .1)',
    borderRadius: 12,
    boxShadow: '0 16px 48px rgba(0, 0, 0, .48)',
    animation: '500ms',
  },
  icon: {
    ...theme.mixins.size(33),
    flexShrink: 0,
    marginTop: 2,
    backgroundImage: (props: Props) => `url(${getApplicationIconURL(getDialogApplication(props.dialog))})`,
    backgroundSize: 'cover',
    borderRadius: 100,
  },
  content: {
    flexGrow: 1,
    padding: '0 10px',
    wordWrap: 'break-word',
    width: (props: Props) => actionCTAOnBottom(props) ? 'calc(100% - 33px)' : 'inherited',
  },
  title: {
    fontWeight: 600,
    marginBottom: 5,
  },
  dialogMessage: {
    ...theme.mixins.ellipsis(4),
    fontSize: 13,
    marginTop: 10,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: (props: Props) => actionCTAOnBottom(props) ? 'row' : 'column',
    justifyContent: (props: Props) => actionCTAOnBottom(props) ? 'space-evenly' : 'center',
    margin: (props: Props) => actionCTAOnBottom(props) ? '20px auto 0 10%' : 'inherited',
    width: (props: Props) => actionCTAOnBottom(props) ? '90%' : 'inherited',
  },
  buttonContainer: {
    marginBottom: 5,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  buttonText: {
    margin: 0,
  },
});

@injectSheet(styles)
class DialogItemImpl extends React.PureComponent<Props, {}> {
  render() {
    const { classes, dialog, onClickDialog, applicationName } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.icon} />

        <div className={classes!.content}>
          <div className={classes!.title}>
            {applicationName}
          </div>

          <h4>{getDialogTitle(dialog)}</h4>
          <p className={classes!.dialogMessage}>{getDialogMessage(dialog)}</p>
        </div>

        <div className={classes!.buttonWrapper}>
          {
            getDialogActions(dialog).map((action) => {
              const { icon, text, style } = action;

              const onClick = (_: any) => onClickDialog(dialog.toJS(), action);

              return <div
                key={`dialog-item-${shortid.generate()}`}
                onClick={onClick}
                className={classes!.buttonContainer}
              >
                {text ? (
                  <Button
                    btnStyle={style}
                  >
                    {text}
                  </Button>
                ) : (
                    <Button
                      btnStyle={style}
                    >
                      <Icon symbolId={icon!} size={34} />
                    </Button>
                  )}

              </div>;
            })
          }
        </div>
      </div>
    );
  }
}

export default compose(
  withGetApplication({
    options: (props: Props) => ({
      variables: {
        applicationId: getApplicationId(getDialogApplication(props.dialog)),
      },
    }),
    props: ({ data }) => ({
      applicationName: oc(data).application.name(),
    }),
  }),
)(DialogItemImpl);
