import * as React from 'react';
import {
  OpenPopupOptions,
  PopupManagerInternal,
} from './__internal__/popupManagerInternal';
import { PopupItem } from './__internal__/PopupItem';
import { popupInstance } from './popupsDef';

interface IPopupManagerDeprecated {

  open<T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptions<T>,
  ): popupInstance;

  closeAll(): void;

  /* @deprecated: this is for internal usage only*/
  openPopups: PopupItem[];

  /* @deprecated: this is for internal usage only*/
  onPopupsChangeEvents: Function[];

  /* @deprecated: this is for internal usage only*/
  close(guid: string);

  /* @deprecated: this is for internal usage only*/
  subscribeOnPopupsChange(callback: Function): void;
}

class PopupManagerDeprecated extends PopupManagerInternal
  implements IPopupManagerDeprecated {
  public get openPopups() {
    return this.popups;
  }

  public get onPopupsChangeEvents(): Function[] {
    return this._onPopupsChangeEvents;
  }

  public close(guid: string) {
    return super.close(guid);
  }

  public subscribeOnPopupsChange(callback: Function): void {
    return super.subscribeOnPopupsChange(callback);
  }
}

type Constructable<T> = new (...args: []) => T;

export type PopupManager = IPopupManagerDeprecated;
export const PopupManager: Constructable<PopupManager> = PopupManagerDeprecated as any;
