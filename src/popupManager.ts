import * as React from 'react';
import {
  deprecatedWarningMessage,
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

function deprecated(functionName) {
  console.warn(deprecatedWarningMessage(functionName));
}

class PopupManagerDeprecated extends PopupManagerInternal
  implements IPopupManagerDeprecated {
  public get openPopups() {
    deprecated('openPopups');
    return this.popups;
  }

  public get onPopupsChangeEvents(): Function[] {
    deprecated('onPopupsChangeEvents');
    return this._onPopupsChangeEvents;
  }

  public close(guid: string) {
    deprecated('close');
    return super._close(guid);
  }

  public subscribeOnPopupsChange(callback: Function): void {
    deprecated('subscribeOnPopupsChange');
    return super._subscribeOnPopupsChange(callback);
  }
}

type Constructable<T> = new (...args: []) => T;

export type PopupManager = IPopupManagerDeprecated;
export const PopupManager: Constructable<PopupManager> = PopupManagerDeprecated as any;
