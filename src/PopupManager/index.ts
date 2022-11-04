import { PopupItem } from "../PopupItem";
import {uniqueId} from 'lodash';
import { PopupInstance, PopupProps } from "../models";

export type OpenPopupOptions<T> = Omit<T & PopupProps, 'show'>;

export class PopupManager {
    private openPopups: PopupItem[] = [];
    public onPopupsChangeEvents: Function[] = [];
    public deletionTimeout = 500;
  
    private callPopupsChangeEvents() {
      this.onPopupsChangeEvents.forEach(cb => cb());
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
      return this.openPopups;
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

      setTimeout(() => {
        const currentPopupIndex = this.openPopups.findIndex(
          ({ guid }) => guid === popupGuid,
        );
        this.openPopups.splice(currentPopupIndex, 1);
      }, this.deletionTimeout)
      
  
      this.callPopupsChangeEvents();
    }
  
    public closeAll = (): void => {
      this.openPopups.forEach(popup => {
        popup.close();
      });
      this.openPopups = [];
      this.callPopupsChangeEvents();
    };
  }