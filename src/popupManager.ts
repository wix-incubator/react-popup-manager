import * as React from 'react';
import {
  OpenPopupOptions,
  PopupManagerInternal,
} from './__internal__/popupManagerInternal';
import { PopupItem } from './__internal__/PopupItem';
import { popupInstance } from './popupsDef';
import {
  deprecatedPropWarningMessage,
  deprecatedWarningMessage,
} from './__internal__/common';

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

function deprecatedProp(propName) {
  console.warn(deprecatedPropWarningMessage(propName));
}

class PopupManagerDeprecated extends PopupManagerInternal
  implements IPopupManagerDeprecated {
  public open<T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptions<T>,
  ): popupInstance {
    if ((popupProps as any).isOpen) {
      deprecatedProp('isOpen');
    }
    return super.open(componentClass, popupProps);
  }

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
