const styles = {
  buttonContainer: {
    textAlign: 'center',
    marginTop: 30,
  },
  container: {
    padding: [30, 20, 0, 20],
  },
  resultsContent: {
    padding: [24, 0, 30],
    margin: 0,
    listStyleType: 'none',
    display: 'grid',
    gap: [8, 18],
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [40, 45, 57, 45],
    },
    buttonContainer: {
      display: 'none',
    },
  },
};

export interface AppStoreMyCustomAppsListClasses {
  buttonContainer: string,
  container: string,
  resultsContent: string,
}

export default styles;
