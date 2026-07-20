import { GradientType, withGradient } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import {
  SearchResultSerialized,
  SearchSectionSerialized,
  selectItem,
  setSearchValue,
} from '../duck';
import BangBottom from './BangBottom';
import BangInput from './BangInput';
import BangList from './BangList';

interface Classes {
  content: string;
}

export interface OwnProps {
  classes?: Classes;
  searchValue: string;
  items: SearchSectionSerialized[];
  historyItems: SearchResultSerialized[];
  isVisible: boolean;
  shouldShowInsert: boolean;
  focus: number | undefined;
  isGDriveConnected: boolean;
  onSearchValueChange: typeof setSearchValue;
  onSelectItem: typeof selectItem;
  onShowSettings: () => void;
  onQuit: () => void;
  setHighlightedItemId: (id: string) => void;
  highlightedItemId?: string;
  kbShortcut: string;
  setRef: (ref: BangInput | null) => void;
  handleArrowDown: () => void;
  handleArrowUp: () => void;
  handleTab: () => void;
  handleShiftTab: () => void;
  handleEnter: (modifier: { altKey: boolean }) => void;
  handleClick: (itemId: string, position: number) => void;
  resetHighlightedItem: () => void;
  onCollapseSection: () => void;
}

interface StateFromProps {
  themeGradient: string;
}

type Props = OwnProps & StateFromProps;

@injectSheet({
  content: {
    width: 520,
    height: 'min(640px, calc(100vh - 96px))',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginTop: 32,
    backgroundColor: '#202124',
    backgroundImage: 'none',
    border: '1px solid rgba(255, 255, 255, .1)',
    borderRadius: 12,
    boxShadow: '0 18px 56px rgba(0, 0, 0, .52)',
    overflow: 'hidden',
  },
})
class BangPresenterImpl extends React.PureComponent<Props, {}> {
  render() {
    const {
      classes,
      searchValue,
      shouldShowInsert,
      onSearchValueChange,
      onQuit,
      historyItems,
      items,
      highlightedItemId,
      kbShortcut,
      setRef,
      handleEnter,
      handleClick,
      resetHighlightedItem,
      onCollapseSection,
    } = this.props;

    const hasEmptyQuery = searchValue === '';

    return (
      <div className={`${classes!.content} station-quick-switch`}>
        <BangInput
          refBangInput={setRef}
          onValueChange={onSearchValueChange}
          value={searchValue}
          onArrowDown={this.props.handleArrowDown}
          onArrowUp={this.props.handleArrowUp}
          onTab={this.props.handleTab}
          onShiftTab={this.props.handleShiftTab}
          onEnter={handleEnter}
          onEscape={onQuit}
          shortcut={shouldShowInsert ? kbShortcut : undefined}
        />

        <BangList
          forEmptyQuery={hasEmptyQuery}
          items={items}
          historyItems={historyItems}
          highlightedItemId={highlightedItemId}
          onItemClick={handleClick}
          onResetHighlightedItem={resetHighlightedItem}
          onCollapseSection={onCollapseSection}
        />

        <BangBottom onClickSettings={this.props.onShowSettings} />
      </div>
    );
  }
}

export default withGradient(GradientType.withDarkOverlay)(BangPresenterImpl);
