import * as React from 'react';
import { PopupProps } from '../popupsDef';

interface TestPopup1Props extends PopupProps {
    content: string;
}

interface TestPopup2Props extends PopupProps {
    [s: string]: any;
}

export const TestPopup1 = (props: TestPopup2Props) => (
  <div data-hook="test-hook">
    <span data-hook="popup-content">{props.content}</span>
    <button data-hook="close-button" onClick={() => props.onClose('value', true, 1)} />
  </div>
);

export const TestPopup2 = (props: TestPopup1Props) => (
  <div data-hook="test-hook2">
    <button data-hook="close-button" onClick={() => props.onClose} />
  </div>
);
