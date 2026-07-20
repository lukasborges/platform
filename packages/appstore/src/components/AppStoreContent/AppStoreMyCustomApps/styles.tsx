import { colors } from '@src/theme';

const styles = {
  section: {
    height: '100%',
  },
  container: {
    padding: [30, 20, 0, 20],
  },
  goBackBtn: {
    alignItems: 'center',
    background: 'transparent',
    border: 0,
    borderRadius: 6,
    color: colors.blueGray100,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 13,
    fontWeight: 500,
    gap: 7,
    marginLeft: -8,
    marginBottom: 30,
    outline: 0,
    opacity: .77,
    padding: [6, 8],
    '&:hover': {
      backgroundColor: colors.hoverBlue,
      opacity: 1,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .35)',
    },
  },
  stepperContainer: {
    maxWidth: 330,
    minHeight: 450,
    margin: '0 auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [30, 45, 0, 45],
    },
  },
};

export interface AppStoreMyCustomAppsClasses {
  section: string,
  container: string,
  goBackBtn: string,
  stepperContainer: string,
}

export default styles;
