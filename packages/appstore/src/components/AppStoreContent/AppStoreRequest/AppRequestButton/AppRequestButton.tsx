import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import * as classNames from 'classnames';
import { colors } from '@src/theme';
import { Icon, IconSymbol, Size } from '@getstation/theme';
import { customAppsMode, screenHash } from '@src/shared/constants/constants';
import {
  useSetCustomAppRequestModeMutation, useSetSearchStringMutation,
} from '@src/components/AppStoreAside/AppStoreAsideNav/AppStoreAsideNavButton/queries.gql.generated';

// STYLES

const useStyles = createUseStyles({
  appRequestTooltip: {
    width: 100,
    borderRadius: 5,
    backgroundColor: 'gray',
    position: 'absolute',
    right: 60,
    padding: [6, 0, 8],
    top: 2,
    display: 'none',
    '&.visible': {
      display: 'block',
    },
  },
  addAppBtn: {
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: colors.blueGray40,
    border: `1px solid ${colors.buttonBorder}`,
    borderRadius: 8,
    color: colors.blueGray100,
    cursor: 'pointer',
    display: 'inline-flex',
    height: 36,
    justifyContent: 'center',
    outline: 0,
    transition: 'background-color 120ms ease, border-color 120ms ease',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
      borderColor: colors.gray,
    },
    '&:active': {
      backgroundColor: colors.blueGray30,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .45)',
    },
    '&.addAppBtn_small': {
      padding: [0, 21],
    },
    '&.addAppBtn_big': {
      padding: [0, 31],
    },
  },
  addAppPlusIcon: {
    marginRight: 7,
  },
});

// PROPS

interface Props {
  btnSize: number,
  children?: React.ReactElement,
}

// COMPONENT

const AppRequestButton = ({
  children,
  btnSize,
}: Props) => {
  const classes = useStyles();
  const history = useHistory();

  // Mutation to activate Add Custom App process
  const [customAppRequestMode, { data, loading, error }] = useSetCustomAppRequestModeMutation({ variables: {
    appRequestIsOpen: true,
    currentMode: customAppsMode.createMode,
  }});

  // Mutation to reset the search
  const [resetSearch] = useSetSearchStringMutation({
    variables: {
      searchString: '',
      searchStringAfterEnterPress: '',
      isEnterPressed: false,
    },
  });

  // Navigate and set custom app request mode on
  const onClick = () => {
    resetSearch()
    .then(() => {
      customAppRequestMode();
      history.replace({ pathname: '/', hash: screenHash.MY_CUSTOM_APPS });
    });
  };

  const withChildren = (childNodes: any) => {
    return (
      <div onClick={onClick}>
        {childNodes}
      </div>
    );
  };

  const standAlone = () => {
    return (
      <button
        type="button"
        className={classNames(
          classes!.addAppBtn,
          { addAppBtn_small: btnSize === Size.SMALL },
          { addAppBtn_big: btnSize === Size.BIG },
        )}
        onClick={onClick}
      >
        <Icon symbolId={IconSymbol.PLUS} size={16} className={classes!.addAppPlusIcon} />
        Add a custom app
      </button>
    );
  };

  return (
    <React.Fragment>
      {children
        ? withChildren(children)
        : standAlone()
      }
    </React.Fragment>
  );
};

export default AppRequestButton;
