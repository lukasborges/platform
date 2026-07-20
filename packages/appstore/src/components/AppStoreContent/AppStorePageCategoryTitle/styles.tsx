import { colors } from '@src/theme';
import { AppStorePageCategoryTitleProps } from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';

const styles = {
  categoryTitle: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 10,
    marginBottom: ({ subTitle }: AppStorePageCategoryTitleProps) => subTitle ? 10 : 0,
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '100%',
      height: 1,
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: `${colors.dividerColor}`,
      borderRadius: '2.5px',
    },
  },
  categoryIcon: {
    width: 20,
    minWidth: 20,
    height: 20,
    marginRight: 9,
    opacity: .8,
  },
  categoryName: {
    fontFamily: 'Asap',
    fontSize: 20,
    fontWeight: 500,
    color: colors.blueGray100,
    letterSpacing: 0.42,
  },
  categorySubtitle: {
    fontSize: 14,
    color: colors.blueGray100,
    opacity: 0.7,
  },
};

export interface AppStorePageCategoryTitleClasses {
  categoryTitle: string,
  categoryIcon: string,
  categoryName: string,
  categorySubtitle: string,
  resultsContent: string,
}

export default styles;
