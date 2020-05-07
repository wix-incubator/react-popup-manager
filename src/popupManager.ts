import * as React from 'react';
import { generateGuid } from './utils/generateGuid';
import { PopupAcceptedProps } from './popupsDef';

export interface PopupItem {
  ComponentClass: any;
  props: PopupAcceptedProps & { [key: string]: any };
  guid: string;
}

export interface popupInstance {
  close: Function;
}

type OpenPopupOptions<T> =  T & PopupAcceptedProps;

export class PopupManager {
  public openPopups: PopupItem[] = [];
  public onPopupsChangeEvents: Function[] = [];

  private callPopupsChangeEvents() {
    this.onPopupsChangeEvents.forEach(cb => cb());
  }

  public subscribeOnPopupsChange(callback: Function): void {
    this.onPopupsChangeEvents.push(callback);
  }

  public open<T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptions<T>,
  ): popupInstance {
    const guid = generateGuid();
    this.openPopups.push({
      ComponentClass: componentClass,
      props: popupProps as any,
      guid,
    });

    this.callPopupsChangeEvents();

    return {
      close: () => this.close(guid),
    };
  }

  public close(popupGuid: string): void {
    const currentPopupIndex = this.openPopups.findIndex(
      ({ guid }) => guid === popupGuid,
    );

    if (currentPopupIndex === -1) {
      return;
    }

    this.openPopups.splice(currentPopupIndex, 1);
    this.callPopupsChangeEvents();
  }

  public closeAll(): void {
    this.openPopups = [];
    this.callPopupsChangeEvents();
  }
}
