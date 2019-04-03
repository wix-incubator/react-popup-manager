import {popupInstance, PopupManager} from '../popupManager';
import { TestPopup1, TestPopup2 } from './testPopups';

export class TestPopupsManager extends PopupManager {
  public openTestPopup1(onClose?: () => void, content?: string): popupInstance {
    return this.open(TestPopup1, { onClose, content });
  }

  public openTestPopup2(): popupInstance {
    return this.open(TestPopup2);
  }
}
