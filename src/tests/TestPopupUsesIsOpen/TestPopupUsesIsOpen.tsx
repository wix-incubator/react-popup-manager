import * as React from 'react';
import {PopupProps} from '../../popupsDef';

interface TestPopupUsesIsOpen extends PopupProps {
  content?: string;
  dataHook?: string;
  overrideCloseArgs?: any[];
}

export const generateDataHook = (index = 0) => `test-popup-${index}`;
export const TestPopupUsesIsOpen = (props: TestPopupUsesIsOpen) => {
  return (
  <div data-is-open={props.isOpen} data-hook={props.dataHook || generateDataHook()}>
    <span data-hook="popup-content">{props.content}</span>
    <button data-hook="close-button" onClick={() => props.overrideCloseArgs ? props.onClose!(...props.overrideCloseArgs): props.onClose!()}/>
  </div>
)};
