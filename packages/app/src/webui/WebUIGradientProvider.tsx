import { GradientProvider } from '@getstation/theme';
import * as React from 'react';
import { Observable, Subscription } from 'rxjs';

export type Props = {
  children: any,
  themeColorsObservable: Observable<string[]>,
};

export type State = {
  themeColors: string[],
};

export class WebUIGradientProvider extends React.Component<Props, State> {
  subscription: Subscription;

  constructor(props: Props) {
    super(props);
    this.state = {
      // default theme colors, just in case
      themeColors: ['#202124', '#202124', '#25262a', '#2b2c31'],
    };

    this.subscription = props.themeColorsObservable.subscribe(themeColors => {
      this.setState({ themeColors });
    });
  }

  componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <GradientProvider themeColors={this.state.themeColors}>
        {this.props.children}
      </GradientProvider>
    );
  }
}
