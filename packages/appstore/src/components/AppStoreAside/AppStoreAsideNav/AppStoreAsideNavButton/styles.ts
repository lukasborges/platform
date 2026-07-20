import { colors } from '@src/theme';

const styles = {
  navButton: {
    listStyleType: 'none',
    minHeight: 38,
    padding: [0, 12],
    margin: [2, 10],
    borderRadius: 10,
    color: colors.blueGray100,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color .2s',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
    },
  },
  activeNavButton: {
    backgroundColor: colors.hoverBlue,
    transition: 'background-color .2s',
  },
  content: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    transition: 'color .2s',
  },
  title: {
    color: colors.blueGray100,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  titleName: {
    marginRight: 4,
  },
  icon: {
    minWidth: '14px',
    width: '14px',
    height: '14px',
    marginRight: '12px',
    filter: 'grayscale(1) brightness(1.8)',
  },
  '@media (min-width: 600px)': {
    navButton: {
      padding: [0, 12],
    },
  },
};

export interface IClasses {
  navButton: string,
  activeNavButton: string,
  content: string,
  title: string,
  titleName: string,
  icon: string,
}

export default styles;
