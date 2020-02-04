import { PopupManager } from './popupManager';

export interface PopupProps {
  onClose?(...params): any;
  isOpen?: boolean;
}

export interface WithPopupsProps {
  popupManager: PopupManager;
}
