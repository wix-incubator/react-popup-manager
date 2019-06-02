import * as React from 'react';
import { PopupProps } from '../popupsDef';

interface TestPopupProps extends PopupProps {
  [s: string]: any;
}

export const TestPopup1 = (props: TestPopupProps) => (
  <div data-hook="test-hook">
    <span data-hook="popup-content">{props.content}</span>
    <button data-hook="close-button" onClick={() => props.onClose('value', true, 1)} />
  </div>
);

export const TestPopup2 = (props: TestPopupProps) => (
  <div data-hook="test-hook2">
    <button data-hook="close-button" onClick={() => props.onClose} />
  </div>
);
