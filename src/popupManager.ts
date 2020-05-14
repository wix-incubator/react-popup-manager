import {
  PopupManagerInternal,
  OpenPopupOptions,
} from './__internal__/popupManagerInternal';
import { popupInstance } from './popupsDef';

type Constructable<T> = new (...args: []) => T;

export interface PopupManager {
  open<T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptions<T>,
  ): popupInstance;

  closeAll(): void;
}
export const PopupManager: Constructable<PopupManager> = PopupManagerInternal as any;
