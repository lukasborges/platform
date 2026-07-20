import * as React from 'react';
import injectSheet from 'react-jss';

export interface Props {
  classes?: any,
  handleClick: () => any,
  duration: string
}

@injectSheet(() => ({
  item: {
    color: 'rgba(255, 255, 255, .64)',
    fontSize: '12px',
    transition: 'all 250ms ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, .07)',
    },
    borderRadius: 5,
    margin: [3, 0],
    padding: [3, 5],
  },
}))
class NotificationCenterSnoozePanelItem extends React.PureComponent<Props, {}> {

  render() {
    const { classes } = this.props;
    return (
      <li className={classes.item}>
        <a onClick={this.props.handleClick}>
          {this.props.duration}
        </a>
      </li>
    );
  }
}

export default NotificationCenterSnoozePanelItem;
