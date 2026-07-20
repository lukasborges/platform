import { colors } from '@src/theme';

const styles = {
  header: {
    width: '100%',
  },
  headerBanner: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.stationBlue,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: '30px',
    fontWeight: '500',
    color: colors.blueGray100,
    zIndex: 30,
  },
  downloadLink: {
    backgroundColor: colors.blueGray40,
    borderRadius: 20,
    border: 0,
    marginLeft: 25,
    color: colors.stationBlue,
    fontSize: 14,
    fontWeight: '600',
    padding: '4px 15px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
    },
    '&:active': {
      backgroundColor: colors.activeSuggestion,
    },
  },
  '@media (max-width: 1279px)': {
    headerBanner: {
      display: 'none',
    },
  },
};

export interface AppStoreHeaderClasses {
  header: string,
  headerBanner: string,
  downloadLink: string,
}

export default styles;
