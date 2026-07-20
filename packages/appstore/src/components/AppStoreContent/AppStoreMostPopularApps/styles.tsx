const styles = {
  container: {
    padding: [24, 20, 48],
  },
  resultsContent: {
    padding: 0,
    margin: 0,
    listStyleType: 'none',
    display: 'grid',
    gap: [8, 18],
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [30, 40, 56],
    },
  },
};

export interface AppStoreMostPopularAppsClasses {
  container: string,
  resultsContent: string,
}

export default styles;
