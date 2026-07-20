import { colors } from '@src/theme';

const styles = {
  application: {
    border: '1px solid transparent',
    borderRadius: 10,
    boxSizing: 'border-box',
    color: colors.blueGray100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
    minWidth: 0,
    padding: [9, 10],
    backgroundColor: 'transparent',
    transition: 'background-color 120ms ease, border-color 120ms ease',
    width: '100%',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
      borderColor: colors.dividerColor,
    },
  },
  applicationContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  applicationDetails: {
    flex: 1,
    minWidth: 0,
  },
  applicationNameContainer: {
    display: 'block',
    minWidth: 0,
  },
  applicationName: {
    display: 'block',
    fontSize: 15,
    fontWeight: 600,
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  applicationControls: {
    alignItems: 'center',
    display: 'flex',
    gap: 4,
    marginLeft: 8,
  },
  categoryName: {
    fontSize: '12px',
    color: colors.darkGray,
  },
  action: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: 6,
    color: colors.blueGray100,
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 30,
    justifyContent: 'center',
    opacity: .65,
    outline: 0,
    padding: 0,
    transition: 'background-color 120ms ease, opacity 120ms ease',
    width: 30,
    '&:hover': {
      backgroundColor: colors.blueGray40,
      opacity: 1,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .35)',
      opacity: 1,
    },
  },
};

export interface AppStoreApplicationClasses {
  application: string,
  applicationContent: string,
  applicationDetails: string,
  applicationNameContainer: string,
  applicationName: string,
  applicationControls: string,
  categoryName: string,
  action: string,
}

export default styles;
