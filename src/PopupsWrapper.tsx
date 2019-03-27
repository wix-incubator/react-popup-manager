import * as React from 'react';
import { PopupItem, PopupManager } from './popupManager';

export interface PopupsWrapperProps {
  popupManager: PopupManager;
}

export class PopupsWrapper extends React.Component<any> {
  constructor(props) {
    super(props);
    props.popupManager.subscribeOnPopupsChange(() => this.forceUpdate());
  }

  private onClose(currentPopup: PopupItem) {
    this.props.popupManager.close(currentPopup);
    currentPopup.props &&
      currentPopup.props.onClose &&
      currentPopup.props.onClose();
  }

  public render() {
    const { popupManager } = this.props;

    return popupManager.openPopups.map((currentPopup, index) => (
      <currentPopup.ComponentClass
        {...currentPopup.props}
        key={index}
        onClose={() => this.onClose(currentPopup)}
      />
    ));
  }
}
