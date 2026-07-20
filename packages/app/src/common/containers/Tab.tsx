import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  tab: string,
}

type RenderFunction = () => React.ReactElement | React.ReactElement[];

export interface Props {
  children: RenderFunction,
  classes?: Classes,
  onClick?: () => void,
  title: string,
  isActive?: boolean,
}

const styles = () => ({
  tab: {
    alignItems: 'center',
    borderRadius: 7,
    color: 'rgba(255, 255, 255, .68)',
    display: 'flex',
    lineHeight: '38px',
    margin: [0, 14, 4, 0],
    padding: [0, 14],
    boxSizing: 'border-box',
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: 'none',
    transition: 'background-color 150ms ease-out, color 150ms ease-out',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .055)',
      color: 'rgba(255, 255, 255, .9)',
    },
    '&.active': {
      backgroundColor: 'rgba(255, 255, 255, .1)',
      color: '#fff',
    },
  },
});

@injectSheet(styles)
export default class Tab extends React.PureComponent<Props, {}> {
  render() {
    const { title, classes, isActive } = this.props;
    return (
      <li className={classNames(classes!.tab, 'station-settings__tab', { active: isActive })}>
        <a onClick={this.props.onClick}>
          {title}
        </a>
      </li>
    );
  }
}
