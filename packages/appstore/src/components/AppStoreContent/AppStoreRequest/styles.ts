const styles = {
  container: {
    padding: [30, 20, 100, 20],
  },
  stepperContainer: {
    maxWidth: 330,
    minHeight: 650,
    margin: '0 auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [30, 45, 131, 45],
    },
  },
};

export interface AppRequestClasses {
  container: string,
  stepperContainer: string,
}

export default styles;
