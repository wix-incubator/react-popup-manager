import { generateGuid } from '../utils/generateGuid';
import { popupInstance, PopupProps } from '../popupsDef';
import { PopupItem } from './PopupItem';
import { PopupManager } from '../popupManager';

const CLOSED_POPUPS_THRESHOLD = 10;

export type OpenPopupOptions<T> = Omit<T & PopupProps, 'isOpen'>;

export class PopupManagerInternal implements PopupManager {
  private openPopups: PopupItem[] = [];
  private readonly _closedPopups: PopupItem[] = [];
  public onPopupsChangeEvents: Function[] = [];

  private callPopupsChangeEvents() {
    this.onPopupsChangeEvents.forEach((cb) => cb());
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
    return [...this.openPopups, ...this.closedPopups];
  }

  public open = <T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptions<T>,
  ): popupInstance => {
    if (popupProps && (popupProps as any).isOpen !== undefined) {
      throw new Error(
        `it is not allowed to send 'isOpen' in popupProps to 'popupManager.open(component, popupProps)'`,
      );
    }

    const guid = generateGuid();
    const newPopupItem = new PopupItem(componentClass, popupProps as any, guid);
    this.openPopups.push(newPopupItem);

    this.callPopupsChangeEvents();
    return {
      close: () => this.close(guid),
    };
  };

  public close(popupGuid: string): void {
    const currentPopupIndex = this.openPopups.findIndex(
      ({ guid }) => guid === popupGuid,
    );

    if (currentPopupIndex === -1) {
      return;
    }

    const currentPopup = this.openPopups[currentPopupIndex];

    currentPopup.close();

    const closedPopup = this.openPopups.splice(currentPopupIndex, 1)[0];
    this.closedPopups.unshift(closedPopup);
    this.callPopupsChangeEvents();
  }

  public closeAll = (): void => {
    this.openPopups.forEach((popup) => {
      popup.close();
      this.closedPopups.unshift(popup);
    });
    this.openPopups = [];
    this.callPopupsChangeEvents();
  };
}
