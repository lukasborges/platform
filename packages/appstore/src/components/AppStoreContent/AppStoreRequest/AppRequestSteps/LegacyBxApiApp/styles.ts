import { animStylesData } from '@src/shared/constants/constants';
import { colors } from '@src/theme';

const styles = {
  stepContainer: {
    marginTop: 64,
    '&.fade-appear': {
      transform: `translateX(${animStylesData.translateRight})`,
      '&.fade-appear-active': {
        transform: 'translateX(0)',
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-enter': {
      transform: `translateX(${animStylesData.translateLeft})`,
      '&.fade-enter-active': {
        transform: 'translateX(0)',
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 38,
  },
  text: {
    fontSize: 17,
    color: colors.darkGray,
    textAlign: 'center',
  },
};

export interface IClasses {
  stepContainer: string,
  stepContent: string,
  text: string,
}

export default styles;
