import { colors } from '@src/theme';
import { AppRequestStepsButtonsClassesProps }
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';

const styles = {
  controlsContainer: {
    display: 'flex',
    justifyContent: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'space-between' : 'center',
  },
  cancelBtn: {
    width: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'calc(100%/2 - 7px)' : 'calc(100% - 14px)',
    backgroundColor: colors.blueGray40,
    fontSize: 12,
    fontWeight: 600,
    color: colors.blueGray100,
    height: 36,
    padding: [0, 12],
    border: `1px solid ${colors.buttonBorder}`,
    borderRadius: 8,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 120ms ease, border-color 120ms ease',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
      borderColor: colors.gray,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .45)',
    },
  },
  onContinueBtn: {
    width: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'calc(100%/2 - 7px)' : 'calc(100% - 14px)',
    backgroundColor: ({ bgColor }: AppRequestStepsButtonsClassesProps) => bgColor ? bgColor : colors.activeSuggestion,
    fontSize: 12,
    fontWeight: 600,
    color: colors.blueGray100,
    height: 36,
    padding: [0, 12],
    border: `1px solid ${colors.buttonBorder}`,
    borderRadius: 8,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 120ms ease, border-color 120ms ease',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
      borderColor: colors.gray,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .45)',
    },
  },
};

export interface AppRequestStepsButtonsClasses {
  controlsContainer: string,
  cancelBtn: string,
  onContinueBtn: string,
}

export default styles;
