import * as React from 'react';

export interface PopupItem {
  ComponentClass: any;
  props: any;
}

export class PopupManager {
  public openPopups: PopupItem[] = [];
  public onPopupsChangeEvents: Function[] = [];

  private callPopupsChangeEvents() {
    this.onPopupsChangeEvents.forEach(cb => cb());
  }

  public subscribeOnPopupsChange(callback: Function): void {
    this.onPopupsChangeEvents.push(callback);
  }

  public open(componentClass: React.ComponentType<any>, popupProps?: {}): void {
    this.openPopups.push({
      ComponentClass: componentClass,
      props: popupProps,
    });

    this.callPopupsChangeEvents();
  }

  public close(popup: PopupItem): void {
    const currentPopupIndex = this.openPopups.indexOf(popup);
    this.openPopups.splice(currentPopupIndex, 1);
    this.callPopupsChangeEvents();
  }

  public closeAll(): void {
    this.openPopups = [];
    this.callPopupsChangeEvents();
  }
}
