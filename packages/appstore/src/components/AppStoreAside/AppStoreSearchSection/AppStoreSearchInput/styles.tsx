import { colors } from '@src/theme';

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  label: {
    width: '100%',
    height: '34px',
    backgroundColor: colors.white,
    borderRadius: '10px',
    border: `1px solid ${colors.dividerColor}`,
    display: 'flex',
    alignItems: 'center',
    color: colors.blueGray100,
    overflow: 'hidden',
    '&.active-focus': {
      boxShadow: `0 0 0 1px ${colors.buttonBorder}`,
      border: `1px solid ${colors.blueGlowing}`,
    },
  },
  searchIcon: {
    width: '15px',
    height: '15px',
    marginLeft: 5,
    opacity: '.5',
    filter: 'grayscale(1) brightness(1.8)',
  },
  autosuggestInput: {
    width: '100%',
    placeholder: colors.blueGray100,
    fontSize: 13,
    border: 'none',
    flexGrow: 1,
    height: '100%',
    padding: [0, 3],
    outline: 'none',
    color: colors.blueGray100,
    backgroundColor: 'transparent',
    borderRadius: '0 20px 20px 0',
    transform: 'translate3d(0,-1px,0)',
    '-webkit-appearance': 'none',
  },
};

export interface IClasses {
  container: string,
  label: string,
  searchIcon: string,
  input: string,
  autosuggestInput: string,
}

export default styles;
