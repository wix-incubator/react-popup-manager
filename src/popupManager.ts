import * as React from 'react';
import { generateGuid } from './utils/generateGuid';
import { PopupAcceptedProps } from './popupsDef';

export interface popupInstance {
  close: Function;
}

type OpenPopupOptions<T> = T & PopupAcceptedProps;

type PopupItemProps = PopupAcceptedProps & { [key: string]: any };

const CLOSED_POPUPS_THRESHOLD = 10;

export class PopupItem {
  private _isOpen: boolean;

  constructor(
    public ComponentClass: any,
    public props: PopupItemProps,
    public guid: string,
  ) {
    this._isOpen = true;
  }

  public get isOpen() {
    return this._isOpen;
  }

  public close() {
    this._isOpen = false;
  }
}

export class PopupManagerInternal {
  private _openPopups: PopupItem[] = [];
  private _closedPopups: PopupItem[] = [];
  private readonly withIsOpen: boolean = false;
  public onPopupsChangeEvents: Function[] = [];

  private callPopupsChangeEvents() {
    this.onPopupsChangeEvents.forEach(cb => cb());
  }

  private get closedPopups() {
    this._closedPopups.length = Math.min(
      this._closedPopups.length,
      CLOSED_POPUPS_THRESHOLD,
    );
    return this._closedPopups;
  }

  public subscribeOnPopupsChange(callback: Function): void {
    this.onPopupsChangeEvents.push(callback);
  }

  /* @deprecated: use popups instead*/
  public openPopups = this.popups;

  public get popups() {
    if (this.withIsOpen) {
      return [...this._openPopups, ...this.closedPopups];
    }

    return this._openPopups;
  }

  public open<T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptions<T>,
  ): popupInstance {
    const guid = generateGuid();
    const newPopupItem = new PopupItem(componentClass, popupProps as any, guid);
    this._openPopups.push(newPopupItem);

    this.callPopupsChangeEvents();
    return {
      close: () => this.close(guid),
    };
  }

  public close(popupGuid: string): void {
    const currentPopupIndex = this._openPopups.findIndex(
      ({ guid }) => guid === popupGuid,
    );

    if (currentPopupIndex === -1) {
      return;
    }

    const currentPopup = this._openPopups[currentPopupIndex];

    currentPopup.close();

    const closedPopup = this._openPopups.splice(currentPopupIndex, 1)[0];
    this._closedPopups.unshift(closedPopup);
    this.callPopupsChangeEvents();
  }

  public closeAll(): void {
    this._closedPopups = [...this._openPopups.reverse(), ...this._closedPopups];
    this._openPopups = [];
    this.callPopupsChangeEvents();
  }
}


type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

// fake type - just an idea
type Deprecated<T> = {
  /* @deprecated: is for internal usage only */
  [P in keyof T]: T[P];
};

type IPopupManager = Pick<PopupManagerInternal, "open" | "closeAll"> & Deprecated<Omit<PopupManagerInternal, "open" | "closeAll">> ;

const PopupManager: IPopupManager  = <any>PopupManagerInternal;

const d = new PopupManager();
d.withIsOpen;
d.close('');
