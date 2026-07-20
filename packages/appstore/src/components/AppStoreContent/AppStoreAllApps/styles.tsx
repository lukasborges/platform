import { colors } from '@src/theme';

const styles = {
  allAppsSection: {
    display: 'flex',
    minHeight: '100%',
    width: '100%',
  },
  categoriesContainer: {
    display: 'none',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  categoriesList: {
    boxSizing: 'border-box',
    minWidth: 224,
    maxWidth: 224,
    backgroundColor: colors.blueGray,
    border: `1px solid ${colors.dividerColor}`,
    margin: 0,
    padding: 7,
    borderRadius: 12,
    listStyleType: 'none',
  },
  categoriesItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: 8,
    boxSizing: 'border-box',
    color: colors.blueGray100,
    cursor: 'pointer',
    gap: 9,
    minHeight: 38,
    outline: 0,
    padding: [7, 9],
    textAlign: 'left',
    transition: 'background-color 120ms ease, border-color 120ms ease',
    width: '100%',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
    },
    '&.isActive': {
      backgroundColor: colors.activeSuggestion,
      borderColor: colors.buttonBorder,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .35)',
    },
  },
  categoryIcon: {
    width: 18,
    minWidth: 18,
    height: 18,
    opacity: .75,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.blueGray100,
  },
  dropDown: {
    boxSizing: 'border-box',
    padding: [24, 20, 0],
    position: 'relative',
    width: '100%',
    zIndex: 10,
  },
  dropDownLabel: {
    color: colors.darkGray,
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 7,
  },
  dropDownTitleContainer: {
    backgroundColor: colors.blueGray40,
    border: `1px solid ${colors.buttonBorder}`,
    borderRadius: 8,
    color: colors.blueGray100,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 38,
    outline: 0,
    padding: [0, 12],
    width: '100%',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px rgba(164, 166, 172, .35)',
    },
  },
  dropDownSelection: {
    alignItems: 'center',
    display: 'flex',
    gap: 9,
    minWidth: 0,
  },
  dropDownTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.blueGray100,
  },
  dropDownIcon: {
    opacity: .7,
    transform: 'rotate(-90deg)',
    transition: 'transform 150ms ease',
    '&.isActive': {
      transform: 'rotate(90deg)',
    },
  },
  dropDownCategoriesList: {
    backgroundColor: colors.blueGray,
    border: '1px solid transparent',
    borderRadius: 8,
    boxSizing: 'border-box',
    left: 20,
    maxHeight: 0,
    padding: 0,
    margin: 0,
    listStyleType: 'none',
    overflowY: 'auto',
    position: 'absolute',
    right: 20,
    top: 88,
    transition: 'max-height 150ms ease, padding 150ms ease, border-color 150ms ease',
    '&.isActive': {
      borderColor: colors.buttonBorder,
      maxHeight: 320,
      padding: 6,
    },
  },
  dropDownCategoriesItem: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: 6,
    color: colors.blueGray100,
    cursor: 'pointer',
    display: 'flex',
    gap: 9,
    minHeight: 38,
    outline: 0,
    padding: [7, 9],
    textAlign: 'left',
    width: '100%',
    '&:hover': {
      backgroundColor: colors.hoverBlue,
    },
    '&.isActive': {
      backgroundColor: colors.activeSuggestion,
    },
    '&:focus-visible': {
      boxShadow: 'inset 0 0 0 2px rgba(164, 166, 172, .35)',
    },
  },
  '@media (min-width: 600px)': {
    dropDown: {
      padding: [30, 36, 0],
    },
    dropDownCategoriesList: {
      left: 36,
      right: 36,
      top: 94,
    },
  },
  '@media (min-width: 1024px)': {
    categoriesContainer: {
      display: 'block',
      flex: '0 0 260px',
      padding: [42, 28, 56, 8],
    },
    dropDown: {
      display: 'none',
    },
  },
};

export interface AppStoreAllAppsClasses {
  allAppsSection: string,
  categoriesContainer: string,
  content: string,
  categoriesList: string,
  categoriesItem: string,
  categoryIcon: string,
  categoryText: string,
  dropDown: string,
  dropDownLabel: string,
  dropDownTitleContainer: string,
  dropDownSelection: string,
  dropDownTitle: string,
  dropDownIcon: string,
  dropDownCategoriesList: string,
  dropDownCategoriesItem: string,
  dropDownCategoryText: string,
}

export default styles;
