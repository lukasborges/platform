import { colors } from '@src/theme';
import { ThemeTypes } from '@getstation/theme';
import { AppRequestStepsChooserItemProps }
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsChooserItem/AppRequestStepsChooserItem';

const styles = (theme: ThemeTypes) => ({
  itemContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    border: `1px solid ${theme.colors.gray.light}`,
    borderRadius: theme.$borderRadius,
    padding: 10,
    margin: '10px auto 10px',
    ...theme.fontMixin(13),
    '&:hover': {
      backgroundColor: theme.colors.gray.light,
    },
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 500,
  },
  itemSubtitle: {
    fontSize: 11,
    color: theme.colors.gray.middle,
    marginTop: 2,
  },
  itemButton: {
    backgroundColor: ({ btnBgColor }: AppRequestStepsChooserItemProps) =>
      btnBgColor ? btnBgColor : colors.activeSuggestion,
    fontSize: 12,
    fontWeight: 600,
    color: colors.blueGray100,
    padding: [8, 16],
    border: `1px solid ${colors.buttonBorder}`,
    borderRadius: 8,
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
      borderColor: colors.gray,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .45)',
    },
  },
});

export interface AppRequestStepsChooserItemClasses {
  itemContainer: string,
  itemContent: string,
  itemTitle: string,
  itemSubtitle: string,
  itemButton: string,
}

export default styles;
