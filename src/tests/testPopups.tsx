import * as React from 'react';
import {PopupProps} from '../popupsDef';

interface TestPopup1Props extends PopupProps {
  content: string;
}

interface TestPopup2Props extends PopupProps {
  [s: string]: any;
}

interface TestPopup1WithAnimationProps extends PopupProps {
  timeOutMS: number;
}

class PopupWithAnimation extends React.Component<{ isOpen: boolean, timeOutMS: number }, { isOpen: boolean }> {
  state = {isOpen: false};

  componentDidMount(): void {
    this.setState({isOpen: this.props.isOpen});
  }

  componentWillReceiveProps(nextProps: Readonly<{ isOpen: boolean, timeOutMS: number }>, nextContext: any): void {
    if (nextProps.isOpen) {
      setTimeout(() => this.setState({isOpen: nextProps.isOpen}), nextProps.timeOutMS)
    }
  }

  render() {
    return (
      this.state.isOpen && <div data-hook="test-popup-with-animation">
        {this.props.children}
        </div>
    );
  }
}


export const TestPopupWithAnimation = (props: TestPopup1WithAnimationProps) => (
  <PopupWithAnimation isOpen={props.isOpen} timeOutMS={props.timeOutMS}>
    <button data-hook="close-button" onClick={() => props.onClose()}/>
  </PopupWithAnimation>
);

export const TestPopup1 = (props: TestPopup2Props) => (
  <div data-hook="test-hook">
    <span data-hook="popup-content">{props.content}</span>
    <button data-hook="close-button" onClick={() => props.onClose('value', true, 1)}/>
  </div>
);

export const TestPopup2 = (props: TestPopup1Props) => (
  <div data-hook="test-hook2">
    <button data-hook="close-button" onClick={() => props.onClose}/>
  </div>
);
