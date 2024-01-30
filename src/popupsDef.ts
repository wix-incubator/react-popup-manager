import { PopupManager } from './popupManager';

export interface popupInstance {
  close: Function;
  unmount: Function;
}

export interface PopupProps {
  onClose?: (...args: any[]) => any;
  isOpen?: boolean;
}

export interface WithPopupsProps {
  popupManager: PopupManager;
}
