const styles = {
  container: {
    boxSizing: 'border-box',
    flex: 1,
    minWidth: 0,
    padding: [76, 20, 48],
  },
  resultsContent: {
    padding: [22, 0, 0],
    margin: 0,
    listStyleType: 'none',
    display: 'grid',
    gap: [8, 18],
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [84, 36, 56],
    },
  },
  '@media (min-width: 1024px)': {
    container: {
      padding: [42, 36, 56, 0],
    },
  },
};

export interface AppStoreAllAppsListClasses {
  container: string,
  resultsContent: string,
}

export default styles;
