import {
  PopupManagerInternal,
  IPopupManager,
} from './__internal__/popupManagerInternal';

type Constructable<T> = new (...args: []) => T;

export type PopupManager = IPopupManager;
export const PopupManager: Constructable<IPopupManager> = PopupManagerInternal as any;
