import * as React from 'react';
import { PopupItem, PopupManager } from './popupManager';

export interface PopupsWrapperProps {
  popupManager: PopupManager;
}

interface SinglePopupLifeCycleProps {
  currentPopup: PopupItem;
  onClose(params: any[]): any;
  isOpen: boolean;
}

class SinglePopupLifeCycle extends React.Component<SinglePopupLifeCycleProps> {
  state = { isOpen: false };

  componentDidMount(): void {
    if (this.props.isOpen === true) {
      this.setState({ isOpen: true });
    }
  }

  componentWillReceiveProps(
    nextProps: Readonly<SinglePopupLifeCycleProps>,
    nextContext: any,
  ): void {
    if (nextProps.isOpen === false) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { currentPopup, onClose } = this.props;

    return (
      <currentPopup.ComponentClass
        isOpen={this.state.isOpen}
        {...currentPopup.props}
        onClose={(...params) => onClose(params)}
      />
    );
  }
}

export class PopupsWrapper extends React.Component<PopupsWrapperProps> {
  constructor(props) {
    super(props);
    props.popupManager.subscribeOnPopupsChange(() => this.forceUpdate());
  }

  private onClose(currentPopup: PopupItem, params) {
    this.props.popupManager.close(currentPopup.guid);
    currentPopup.props &&
      currentPopup.props.onClose &&
      currentPopup.props.onClose(...params);
  }

  public render() {
    const { popupManager } = this.props;

    return popupManager.popups.map(currentPopup => (
      <SinglePopupLifeCycle
        currentPopup={currentPopup}
        key={currentPopup.guid}
        isOpen={currentPopup.isOpen}
        onClose={params => this.onClose(currentPopup, params)}
      />
    ));
  }
}
