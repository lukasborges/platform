import { GradientType, ThemeTypes as Theme, withGradient } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
}

export interface OwnProps {
  className?: string,
  onMouseEnter?: React.MouseEventHandler<any>,
  onMouseLeave?: React.MouseEventHandler<any>,
}

export interface StateToProps {
  classes?: Classes,
  themeGradient: string,
}

const styles = (_theme: Theme) => ({
  container: {
    width: 250,
    backgroundColor: '#202124',
    backgroundImage: 'none',
    border: '1px solid rgba(255, 255, 255, .1)',
    borderRadius: 10,
    boxShadow: '0 14px 42px rgba(0, 0, 0, .46)',
    overflow: 'hidden',
  },
});

@injectSheet(styles)
class Popover extends React.PureComponent<StateToProps & OwnProps, {}> {
  render() {
    const { classes, children, className, onMouseEnter, onMouseLeave } = this.props;
    const rest = { onMouseEnter, onMouseLeave };

    return (
      <div className={classNames(classes!.container, className)} {...rest}>
        {children}
      </div>
    );
  }
}

export default withGradient(GradientType.withDarkOverlay)(Popover);
