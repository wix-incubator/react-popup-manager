import * as React from 'react';
import {PopupProps} from '../popupsDef';

interface TestPopupProps extends PopupProps {
  content: string;
  dataHook: string;
}
export const TestPopup = (props: TestPopupProps) => (
  <div data-hook={props.dataHook}>
    <span data-hook="popup-content">{props.content}</span>
    <button data-hook="close-button" onClick={() => props.onClose('value', true, 1)}/>
  </div>
);


export const TestPopupUsesIsOpen = (props: TestPopupProps) => (
  <div is-open={props.isOpen} data-hook={props.dataHook}>
    <span data-hook="popup-content">{props.content}</span>
    <button data-hook="close-button" onClick={() => props.onClose('value', true, 1)}/>
  </div>
);
