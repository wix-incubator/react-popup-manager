import {PopupManager} from '../popupManager';
import { TestPopupUsesIsOpen  } from './testPopups';
import {popupInstance} from '../popupsDef';

export class TestPopupsManager extends PopupManager {
  public openTestPopup(dataHook: string, onClose?: () => void, content?: string): popupInstance {
    return this.open(TestPopupUsesIsOpen, { onClose, content, dataHook });
  }
}
