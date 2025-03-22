import * as React from 'react';
import { PopupItem } from './__internal__/PopupItem';
import { PopupManagerInternal } from './__internal__/popupManagerInternal';

interface PopupsWrapperProps {
  popupManager: PopupManagerInternal;
}

interface SinglePopupLifeCycleProps {
  currentPopup: PopupItem;
  onClose(
    guid: string,
    onConsumerOnCloseCallback: Function,
    ...args: any[]
  ): any;
  isOpen: boolean;
}

class SinglePopupLifeCycle extends React.Component<SinglePopupLifeCycleProps> {
  state = { isOpen: false };

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount(): void {
    if (this.props.isOpen === true) {
      this.setState({ isOpen: true });
    }
  }

  static getDerivedStateFromProps(
    nextProps: Readonly<SinglePopupLifeCycleProps>,
    prevState: any,
  ): any {
    if (nextProps.isOpen === false) {
      return { isOpen: false };
    }

    return null;
  }

  private onClose(...closeArgs: any[]) {
    const { currentPopup, onClose } = this.props;
    if (currentPopup.props?.onClose) {
      onClose(
        currentPopup.guid,
        () => currentPopup.props?.onClose(...closeArgs),
        closeArgs,
      );
    } else {
      onClose(currentPopup.guid, undefined, closeArgs);
    }
  }

  render() {
    const { currentPopup } = this.props;
    return (
      <currentPopup.ComponentClass
        isOpen={this.state.isOpen}
        {...currentPopup.props}
        onClose={this.onClose}
      />
    );
  }
}

export class PopupsWrapper extends React.Component<PopupsWrapperProps> {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount(): void {
    this.props.popupManager.subscribeOnPopupsChange(() => this.forceUpdate());
  }

  private onClose(
    guid: string,
    onConsumerOnCloseCallback?: Function,
    closedArgs?: any[],
  ) {
    this.props.popupManager.close(guid, onConsumerOnCloseCallback, closedArgs);
  }

  public render() {
    const { popupManager } = this.props;

    return popupManager.popups.map(currentPopup => (
      <SinglePopupLifeCycle
        currentPopup={currentPopup}
        key={currentPopup.guid}
        isOpen={currentPopup.isOpen}
        onClose={this.onClose}
      />
    ));
  }
}
