import { colors } from '@src/theme';

const styles = {
  searchSection: {
    padding: '22px 18px 18px',
    backgroundColor: colors.blueGray40,
    color: colors.blueGray100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  title: {
    color: colors.blueGray100,
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    cursor: 'pointer',
  },
  logo: {
    width: '19px',
    height: '22px',
    marginRight: '13px',
    filter: 'grayscale(1) brightness(1.8)',
  },
  logoText: {
    fontFamily: 'Asap',
    fontWeight: 500,
    color: colors.blueGray100,
  },
  burger: {
    width: '20px',
    height: '16px',
    cursor: 'pointer',
  },
  '@media (min-width: 600px)': {
    burger: {
      display: 'none',
    },
    searchSection: {
      padding: '22px 18px 18px',
      borderBottom: `1px solid ${colors.dividerColor}`,
    },
  },
  link: {
    textDecoration: 'none',
  },
};

export interface IClasses {
  searchSection: string,
  content: string,
  title: string,
  logo: string,
  logoText: string,
  burger: string,
  link: string,
}

export default styles;
