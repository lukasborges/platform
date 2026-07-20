import * as React from 'react';

interface Props {
  onClickDock: () => void,
}

export default class DockWrapper extends React.PureComponent<Props, {}> {
  render() {
    const { onClickDock, children } = this.props;

    return (
      <div onClick={onClickDock} className="station-dock">
        {children}
      </div>
    );
  }
}
