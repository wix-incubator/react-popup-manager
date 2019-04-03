import * as React from 'react';
import { PopupItem, PopupManager } from './popupManager';

export interface PopupsWrapperProps {
  popupManager: PopupManager;
}

export class PopupsWrapper extends React.Component<PopupsWrapperProps> {
  constructor(props) {
    super(props);
    props.popupManager.subscribeOnPopupsChange(() => this.forceUpdate());
  }

  private onClose(currentPopup: PopupItem) {
    this.props.popupManager.close(currentPopup.guid);
    currentPopup.props &&
      currentPopup.props.onClose &&
      currentPopup.props.onClose();
  }

  public render() {
    const { popupManager } = this.props;

    return popupManager.openPopups.map(currentPopup => (
      <currentPopup.ComponentClass
        {...currentPopup.props}
        key={currentPopup.guid}
        onClose={() => this.onClose(currentPopup)}
      />
    ));
  }
}
