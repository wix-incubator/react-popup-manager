import * as React from 'react';
import { PopupItem, PopupManager } from './popupManager';

export interface PopupsWrapperProps {
  popupManager: PopupManager;
}

interface SinglePopupLifeCycleProps {
  currentPopup: PopupItem;
  onClose(currentPopup: PopupItem, ...params): any;
  isOpen: boolean;
}

class SinglePopupLifeCycle extends React.Component<SinglePopupLifeCycleProps> {
  state = { isOpen: false };

  componentDidMount(): void {
    if (this.props.isOpen === false) {
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
        {...currentPopup.props}
        isOpen={this.state.isOpen}
        onClose={(...params) => onClose(currentPopup, params)}
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

    return popupManager.openPopups.map(currentPopup => (
      <SinglePopupLifeCycle
        currentPopup={currentPopup}
        key={currentPopup.guid}
        isOpen={true}
        onClose={(...params) => this.onClose(currentPopup, params)}
      />
    ));
  }
}
