import { PopupManager } from './popupManager';

export interface PopupProps {
  onClose(): () => any;
}

export interface WithPopupsProps {
  popupManager: PopupManager;
}
