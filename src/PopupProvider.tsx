import * as React from 'react';
import { PopupManager } from './popupManager';
import { PopupsWrapper } from './PopupsWrapper';
import { PopupContext } from './PopupContext';

export interface PopupsProviderProps {
  popupManager?: PopupManager;
  children?: any;
}

export class PopupProvider extends React.Component<PopupsProviderProps> {
  private readonly popupManager: PopupManager;
  constructor(props, context) {
    super(props, context);
    this.popupManager = props.popupManager || new PopupManager();
  }

  public render() {
    const { children } = this.props;
    return (
      <PopupContext.Provider value={{ popupManager: this.popupManager }}>
        {children}
        <PopupsWrapper popupManager={this.popupManager} />
      </PopupContext.Provider>
    );
  }
}
