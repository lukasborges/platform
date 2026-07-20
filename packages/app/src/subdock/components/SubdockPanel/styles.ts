export interface SubdockListStyle {
  container: string,
  content: string,
  scrollOverlayTop: string,
  scrollOverlayBottom: string,
  title: string,
  sectionHeader: string,
}

export const subdockListStyle = {
  container: {
    position: 'relative',
    flex: '1 1 auto',
    padding: 0,
    width: '100%',
    marginBottom: 8,
  },
  content: {
    maxHeight: 200,
    overflowY: 'scroll',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: 50,
      pointerEvents: 'none',
      zIndex: 1,
      opacity: 0,
      transition: 'opacity 300ms ease-out',
    },
    '&::before': {
      background: 'linear-gradient(#202124, rgba(32,33,36,0))',
    },
    '&::after': {
      bottom: 0,
      background: 'linear-gradient(rgba(32,33,36,0), #202124)',
    },
  },
  title: {
    textTransform: 'uppercase',
    padding: [10, 14, 6],
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '.08em',
    opacity: .55,
    color: '#fff',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollOverlayTop: {
    '&::before': {
      opacity: '1 !important',
    },
  },
  scrollOverlayBottom: {
    '&::after': {
      opacity: '1 !important',
    },
  },
};
