import { PopupManager } from '../popupManager';
import { TestPopup1, TestPopup2 } from './testPopups';

export class TestPopupsManager extends PopupManager {
  public openTestPopup1(onClose?: () => void, content?: string): void {
    this.open(TestPopup1, { onClose, content });
  }

  public openTestPopup2(): void {
    this.open(TestPopup2);
  }
}
