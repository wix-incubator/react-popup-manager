import { generateGuid } from '../utils/generateGuid';
import { PopupAcceptedProps, popupInstance } from '../popupsDef';
import { PopupItem } from './PopupItem';

const CLOSED_POPUPS_THRESHOLD = 10;

export type OpenPopupOptions<T> = T & PopupAcceptedProps;

export class PopupManagerInternal {
  private _openPopups: PopupItem[] = [];
  private readonly _closedPopups: PopupItem[] = [];
  public withIsOpen: boolean = false;
  protected _onPopupsChangeEvents: Function[] = [];

  public get onPopupsChangeEvents() {
    return this._onPopupsChangeEvents;
  }

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
    this._openPopups.forEach(popup => {
      popup.close();
      this._closedPopups.unshift(popup);
    });
    this._openPopups = [];
    this.callPopupsChangeEvents();
  }
}
