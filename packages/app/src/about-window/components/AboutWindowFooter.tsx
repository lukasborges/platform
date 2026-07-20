import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  footer: string,
  link: string,
}

export interface Props {
  classes?: Classes,
}

const styles = () => ({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    color: 'rgba(255, 255, 255, .5)',
    fontSize: 11,
  },
  link: {
    marginLeft: 10,
    fontWeight: 600,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

@injectSheet(styles)
export default class AboutWindowFooter extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <footer className={classes!.footer}>
        <p>2019 - {new Date().getFullYear()}</p>
        <a
          className={classes!.link}
          href="https://github.com/lukasborges/platform"
          target="_blank"
        >
          GitHub
        </a>
        <a
          className={classes!.link}
          href="https://github.com/lukasborges/platform/issues"
          target="_blank"
        >
          Support
        </a>
      </footer>
    );
  }
}
