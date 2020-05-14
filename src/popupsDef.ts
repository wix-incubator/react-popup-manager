import { PopupManager } from './popupManager';

export interface popupInstance {
  close: Function;
}

export interface PopupProps {
  onClose?: (...args: any[]) => any;
  isOpen?: boolean;
}

export interface WithPopupsProps {
  popupManager: PopupManager;
}
