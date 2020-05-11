import { PopupManager } from './popupManager';

export interface PopupAcceptedProps {
  onClose?(...params): any;
}

export interface PopupProps extends PopupAcceptedProps {
  onClose?(...params): any;
  isOpen?: boolean;
}

export interface WithPopupsProps {
  popupManager: PopupManager;
}
