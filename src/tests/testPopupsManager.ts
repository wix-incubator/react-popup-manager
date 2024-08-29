import {PopupManager} from '../popupManager';
import { TestPopupUsesIsOpen  } from './TestPopupUsesIsOpen/TestPopupUsesIsOpen';
import {popupInstance} from '../popupsDef';

export class TestPopupsManager extends PopupManager {
  public openTestPopup(dataHook: string, onClose?: () => void, content?: string, overrideCloseArgs?: any[]): popupInstance {
    return this.open(TestPopupUsesIsOpen, { onClose, content, dataHook , overrideCloseArgs});
  }
}
