import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';

const useStyles = createUseStyles({
  iconContainer: {
    margin: '0 10px 0 0',
    position: 'relative',
    width: 30,
    minWidth: 30,
    height: 30,
    backgroundColor: ({ applicationThemeColor }: Props) => applicationThemeColor,
    borderRadius: '50%',
    overflow: 'hidden',
  },
  icon: {
    display: 'inline-block',
    width: 30,
    height: 30,
  },
});

type Props = {
  applicationIconURL: string,
  applicationThemeColor: string,
};

const ApplicationLogo = ({
  applicationIconURL,
  applicationThemeColor,
}: Props) => {
  const classes = useStyles({ applicationThemeColor });

  return (
    <div className={classes!.iconContainer}>
      {applicationIconURL ?
        <svg className={classes!.icon}>
          <image xlinkHref={`${applicationIconURL}`} width={30} height={30} className={classes!.icon} />
        </svg>
        :
        <Icon symbolId={IconSymbol.APP_ICON_PLACEHOLDER} size={22} />
      }
    </div>
  );
};

export default ApplicationLogo;
