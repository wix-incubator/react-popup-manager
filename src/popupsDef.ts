import { PopupManager } from './popupManager';

export interface popupInstance {
  close: Function;
}

export interface PopupProps {
  onClose?(...params): any;
  isOpen?: boolean;
}

export interface WithPopupsProps {
  popupManager: PopupManager;
}
