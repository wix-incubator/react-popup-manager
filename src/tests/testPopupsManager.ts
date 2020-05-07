import {popupInstance, PopupManager} from '../popupManager';
import { TestPopup  } from './testPopups';

export class TestPopupsManager extends PopupManager {
  public openTestPopup(dataHook: string, onClose?: () => void, content?: string): popupInstance {
    return this.open(TestPopup, { onClose, content, dataHook });
  }
}
