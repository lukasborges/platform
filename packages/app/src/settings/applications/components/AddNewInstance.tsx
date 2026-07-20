import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import { AdwaitaPlusIcon } from './AdwaitaSymbolicIcons';

type Classes = {
  container: string,
  button: string,
  icon: string,
};

type DefaultProps = {
  classes: Partial<Classes>,
  instanceTypeWording: string,
  onClick: () => void,
};

type Props = DefaultProps & {
  name: string,
};

@injectSheet(() => ({
  container: {
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .08)',
    border: '1px solid rgba(255, 255, 255, .08)',
    borderRadius: 8,
    color: 'rgba(255, 255, 255, .88)',
    cursor: 'default',
    display: 'inline-flex',
    fontSize: 13,
    fontWeight: 600,
    gap: 8,
    height: 34,
    outline: 0,
    padding: [0, 13],
    transition: 'background-color 140ms ease-out, border-color 140ms ease-out',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .12)',
      borderColor: 'rgba(255, 255, 255, .12)',
    },
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, .16)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px #3584e4',
    },
  },
  icon: {
    fill: 'currentColor',
    height: 16,
    width: 16,
  },
}))
class AddNewInstance extends React.PureComponent<Props> {

  static defaultProps: DefaultProps = {
    classes: {},
    instanceTypeWording: 'instance',
    onClick: () => { },
  };

  getWording() {
    const { instanceTypeWording, name } = this.props;

    const wording = instanceTypeWording === 'instance' ?
      `instance of ${name}` : instanceTypeWording;

    return `Add a new ${wording}`;
  }

  render() {
    const { classes, onClick } = this.props;

    return (
      <div className={classes.container}>
        <button
          aria-label={this.getWording()}
          className={classes.button}
          onClick={onClick}
          type="button"
        >
          <AdwaitaPlusIcon className={classes.icon} />
          <span>{this.getWording()}</span>
        </button>
      </div>
    );
  }
}

export default AddNewInstance;
