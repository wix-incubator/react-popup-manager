import { useContext } from 'react';
import { PopupManager } from './popupManager';
import { PopupContext } from './PopupContext';

export function usePopupManager(): PopupManager {
  const { popupManager } = useContext(PopupContext);
  const { open, closeAll } = popupManager;

  return {
    open,
    closeAll,
  };
}
