import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { Props as TabProps } from './Tab';

interface Classes {
  titlesContainer: string,
  titles: string,
  panel: string,
}

type TabElement = React.ReactElement<TabProps>;

export interface Props {
  children: TabElement | TabElement[],
  classes?: Classes,
  activeTabTitle: string,
  setActiveTab: (title: string) => void,
}

const styles = () => ({
  titlesContainer: {
    flex: '0 0 170px',
    width: 170,
  },
  titles: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  panel: {
    flex: 1,
    height: '100%',
    marginLeft: 0,
    padding: [0, 8, 32, 32],
    borderLeft: '1px solid rgba(255, 255, 255, .08)',
    overflowY: 'auto',
  },
});

/*
** This component just render tabs with active tab content, it used by SettingOverlay.
*/
@injectSheet(styles)
export default class Tabs extends React.PureComponent<Props, {}> {

  renderChildren() {
    return React.Children.map(this.props.children, (child: TabElement) => {
      return (
        <div onClick={() => this.props.setActiveTab(child.props.title)}>
          { React.cloneElement(child, {
            isActive: child.props.title === this.props.activeTabTitle,
          })}
        </div>
      );
    });
  }

  renderActiveTabContent() {
    const { children, activeTabTitle } = this.props;
    if (!children) return null;

    const childrenArray = React.Children.toArray(children) as TabElement[];
    const activeTab = childrenArray.find((c: TabElement) => c.props.title === activeTabTitle);
    if (!activeTab) return null;
    return activeTab.props.children();
  }

  render() {
    const { classes } = this.props;
    return (
      [
        (
          <div key="tabs-title" className={`${classes!.titlesContainer} station-settings__nav`}>
            <ul className={`${classes!.titles} station-settings__nav-list`}>
              {this.renderChildren()}
            </ul>
          </div>
        ),
        (
          <div key="tabs-panel" className={`${classes!.panel} station-settings__panel`}>
            {this.renderActiveTabContent()}
          </div>
        ),
      ]
    );
  }
}
