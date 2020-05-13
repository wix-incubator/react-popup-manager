import {PopupManager} from '../popupManager';
import { TestPopup  } from './testPopups';
import {popupInstance} from '../popupsDef';

export class TestPopupsManager extends PopupManager {
  public openTestPopup(dataHook: string, onClose?: () => void, content?: string): popupInstance {
    return this.open(TestPopup, { onClose, content, dataHook });
  }
}
