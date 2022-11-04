import { PopupItem } from "../PopupItem";
import {uniqueId} from 'lodash';
import { PopupInstance, PopupProps } from "../models";
const CLOSED_POPUPS_THRESHOLD = 10;

export type OpenPopupOptions<T> = Omit<T & PopupProps, 'show'>;

export class PopupManager {
    private openPopups: PopupItem[] = [];
    private readonly _closedPopups: PopupItem[] = [];
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
    
    public unsubscribeOnPopupsChange(callback: Function): void {
      const index = this.onPopupsChangeEvents.indexOf(callback);
      if(index !== -1){
        this.onPopupsChangeEvents.splice(index, 1);
      }
    }
  
    public get popups() {
      return [...this.openPopups, ...this.closedPopups];
    }
  
    public open = <T>(
      componentClass: React.ComponentType<T>,
      popupProps?: OpenPopupOptions<T>,
    ): PopupInstance => {
      if (popupProps && (popupProps as any).show !== undefined) {
        throw new Error(
          `it is not allowed to send 'show' in popupProps to 'popupManager.open(component, popupProps)'`,
        );
      }
  
      const guid = uniqueId();
      const newPopupItem = new PopupItem(componentClass, popupProps as any, guid);
      this.openPopups.push(newPopupItem);
  
      this.callPopupsChangeEvents();
      return {
        close: () => this.close(guid),
        onCloseClick: (cb) => {
          newPopupItem.onCloseClickPromise = cb; 
          return newPopupItem.onCloseClickPromise;
        }
      };
    };
  
    public close(popupGuid: string, ...params: any[]): void {
      const currentPopupIndex = this.openPopups.findIndex(
        ({ guid }) => guid === popupGuid,
      );
  
      if (currentPopupIndex === -1) {
        return;
      }
  
      const currentPopup = this.openPopups[currentPopupIndex];
  
      currentPopup.close(...params);
  
      const closedPopup = this.openPopups.splice(currentPopupIndex, 1)[0];
      this.closedPopups.unshift(closedPopup);
      this.callPopupsChangeEvents();
    }
  
    public closeAll = (): void => {
      this.openPopups.forEach(popup => {
        popup.close();
        this.closedPopups.unshift(popup);
      });
      this.openPopups = [];
      this.callPopupsChangeEvents();
    };
  }