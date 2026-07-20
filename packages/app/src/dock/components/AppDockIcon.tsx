import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';
import * as classNames from 'classnames';
import * as shortid from 'shortid';

interface Classes {
  anchor: string,
  appDockIcon: string,
  appDockIconActive: string,
  tile: string,
  logo: string,
  scaleUpAnimation: string,
}

export interface OwnProps {
  classes?: Classes,
  applicationId: string,
  active?: boolean,
  badge?: string | number | null,
  isInstanceLogoInDockIcon?: boolean,
  logoURL?: string,
  /**
   * If passed to `true`, when the `AppDockIcon` will
   * get a little animation.
   */
  dramaticEnter?: boolean,
  onOverStateChange?: (newState: boolean) => void,
  onClick?: () => void,
  onRightClick?: () => void,
  iconRef: (el: HTMLDivElement) => void,
}

interface GraphQLProps {
  loading: boolean,
  iconURL?: string,
  themeColor?: string,
  snoozed?: boolean | null,
}

type Props = OwnProps & GraphQLProps;

@injectSheet({
  anchor: {
    alignItems: 'center',
    cursor: 'default',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    margin: 0,
    width: '100%',
  },
  appDockIcon: {
    display: 'block',
    opacity: .82,
    transition: 'opacity 180ms ease-out, transform 180ms ease-out',
    '&:hover': { opacity: 1 },
    '&$appDockIconActive': { opacity: 1 },
    '&$scaleUpAnimation': {
      animation: 'app-dock-icon-scale-up .5s cubic-bezier(0.2, 0, 0, 1)',
    },
  },
  appDockIconActive: {},
  scaleUpAnimation: {},
  tile: { fill: 'rgba(255, 255, 255, .09)' },
  logo: { opacity: .96 },
  '@keyframes app-dock-icon-scale-up': {
    '0%': { transform: 'scale(0)' },
    '90%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
})
export class AppDockIcon extends React.PureComponent<Props> {
  static defaultProps = {
    active: false,
    onClick: () => { },
    onOverStateChange: () => { },
  };

  private readonly primaryClip: string;
  private readonly secondaryClip: string;
  constructor(props: Props) {
    super(props);
    this.primaryClip = `logo-primary-clip-${shortid.generate()}`;
    this.secondaryClip = `logo-secondary-clip-${shortid.generate()}`;
  }

  handleMouseEnter = () => this.props.onOverStateChange!(true);

  handleMouseLeave = () => this.props.onOverStateChange!(false);

  renderSurroundingLink(element: JSX.Element): JSX.Element {
    const { active, classes, onClick, onRightClick, iconRef } = this.props;
    return (
      <div
        className={classNames('station-dock-item', { 'station-dock-item--active': active })}
        ref={iconRef}
      >
        <a
          className={classes!.anchor}
          onClick={onClick}
          onContextMenu={onRightClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {element}
        </a>
      </div>
    );
  }

  renderDefs() {
    return (
      <defs>
        <clipPath id={this.primaryClip}>
          <rect width="26" height="26" x="7" y="7" rx="7" />
        </clipPath>
        <clipPath id={this.secondaryClip}>
          <circle cx="32" cy="32" r="6" />
        </clipPath>
      </defs>
    );
  }

  renderLogos() {
    const { classes, iconURL, isInstanceLogoInDockIcon, logoURL } = this.props;
    const primaryURL = isInstanceLogoInDockIcon && logoURL ? logoURL : iconURL;
    const secondaryURL = isInstanceLogoInDockIcon ? iconURL : logoURL;

    return (
      <g className={classes!.logo}>
        {primaryURL &&
          <image
            clipPath={`url(#${this.primaryClip})`}
            height="26"
            href={primaryURL}
            preserveAspectRatio="xMidYMid meet"
            width="26"
            x="7"
            y="7"
          />
        }
        {secondaryURL &&
          <>
            <circle cx="32" cy="32" r="7" fill="#f4f4f5" />
            <image
              clipPath={`url(#${this.secondaryClip})`}
              height="12"
              href={secondaryURL}
              preserveAspectRatio="xMidYMid meet"
              width="12"
              x="26"
              y="26"
            />
          </>
        }
      </g>
    );
  }

  renderBadge() {
    const { badge, snoozed, active } = this.props;

    if (badge && !snoozed) {
      return (
        <g>
          {active && <circle r="3.5" cx="35" cy="5" fill="#fff" />}
          <circle r="2.3" cx="35" cy="5" fill="#EF5757" />
        </g>
      );
    }
    return null;
  }

  render() {
    const { classes, loading, active, dramaticEnter } = this.props;
    const svgClassName = classNames(classes!.appDockIcon, {
      [classes!.appDockIconActive]: active,
      [classes!.scaleUpAnimation]: dramaticEnter,
    });

    if (loading) return null;

    const svgElement = (
      <svg className={svgClassName} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <g fill="none" fillRule="evenodd">
          {this.renderDefs()}
          <rect className={classes!.tile} width="40" height="40" rx="11" />
          {this.renderLogos()}
          {this.renderBadge()}
        </g>
      </svg>
    );
    return this.renderSurroundingLink(svgElement);
  }
}

export const AppearingAppDockIcon = (props: Props) => {
  // when `dramaticEnter` is true we need to temporarely
  // set the icon as active so that the animation is complete
  const [active, setActive] = React.useState(false);
  const appearingActiveTimer = React.useRef<NodeJS.Timer | null>(null);

  const temporarySetActive = () => {
    setActive(true);
    appearingActiveTimer.current = setTimeout(() => {
      setActive(false);
      appearingActiveTimer.current = null;
    }, 1000);
  };

  React.useEffect(() => {
    if (props.dramaticEnter && !appearingActiveTimer.current) {
      temporarySetActive();
    }
  }, [props.dramaticEnter]);

  return (
    <AppDockIcon
      {...props}
      active={active || props.active}
    />
  );
};
