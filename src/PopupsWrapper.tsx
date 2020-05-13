import * as React from 'react';
import { PopupItem } from './__internal__/PopupItem';
import { PopupManagerInternal } from './__internal__/popupManagerInternal';

interface PopupsWrapperProps {
  popupManager: PopupManagerInternal;
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

  static getDerivedStateFromProps(
    nextProps: Readonly<SinglePopupLifeCycleProps>,
    prevState: any,
  ): any {
    if (nextProps.isOpen === false) {
      return { isOpen: false };
    }

    return null;
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
    props.popupManager._subscribeOnPopupsChange(() => this.forceUpdate());
  }

  private onClose(currentPopup: PopupItem, params) {
    this.props.popupManager._close(currentPopup.guid);
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
