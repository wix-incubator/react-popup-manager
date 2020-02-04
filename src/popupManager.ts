import * as React from 'react';
import { generateGuid } from './utils/generateGuid';
import { PopupProps } from './popupsDef';

export interface PopupItem {
  ComponentClass: any;
  props: PopupProps & { [key: string]: any };
  guid: string;
}

export interface popupInstance {
  close: Function;
}

type Omit<T, K> = Pick<T & PopupProps, Exclude<keyof (T & PopupProps), K>>;

type OpenPopupOptionsOld<T> = T & PopupProps;
type OpenPopupOptions<T> = Omit<T & PopupProps, 'isOpen'>;

// type OpenPopupOptionsOld<T> = {
//   onClose?(...params): any;
//   isOpen?: boolean;
// };
// type OpenPopupOptions<T> = {
//   onClose?(...params): any;
// };

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
  ): popupInstance;

  /** @deprecated should not set isOpen ever  */
  public open<T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptionsOld<T>,
  ): popupInstance;

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
