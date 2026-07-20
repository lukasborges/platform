import { ThemeTypes } from '@getstation/theme';
import { AppRequestStepsInputProps } from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsInput/AppRequestStepsInput';
import { colors } from '@src/theme';

const styles = (theme: ThemeTypes) => ({
  inputWrapper: {
    position: 'relative',
  },
  input: {
    display: 'block',
    appearance: 'none',
    border: (({ error }: AppRequestStepsInputProps) =>
      error ? `2px solid ${theme.colors.error}` : `1px solid ${colors.dividerColor}`) as any,
    padding: [0, 15] as any,
    boxSizing: 'border-box',
    borderRadius: 8,
    minWidth: 200,
    width: '100%',
    height: 38,
    lineHeight: '38px',
    ...theme.fontMixin(11, 500),
    transition: 'all 250ms ease-out',
    color: (({ error }: AppRequestStepsInputProps) =>
      error ? theme.colors.error : colors.blueGray100) as any,
    backgroundColor: colors.blueGray40,
    '&:disabled': {
      opacity: 0.4,
    },
    '&:focus': {
      outline: 'none',
      borderColor: colors.gray,
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .18)',
    },
    '&::-webkit-input-placeholder': {
      color: colors.darkGray,
    },
  },
  error: {
    position: 'absolute',
    top: '-20px',
    left: 0,
    fontSize: 12,
    color: theme.colors.error,
  },
});

export interface AppRequestStepsInputClasses {
  inputWrapper: string,
  error: string,
  input: string,
}

export default styles;
