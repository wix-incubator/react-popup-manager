import { PopupManager } from './popupManager';

export interface PopupProps {
  onClose(...params): any;
}

export interface WithPopupsProps {
  popupManager: PopupManager;
}
