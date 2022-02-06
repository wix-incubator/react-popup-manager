# react-popup-manager &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wix-incubator/typed-locale-keys/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-popup-manager.svg?style=flat)](https://www.npmjs.com/package/react-popup-manager)

Manage react popups, Modals, Lightboxes, Notifications etc.

## What
An agnostic react provider that lets you handle opening and closing popups separately from you're Component `render` function.

## Why
* no need to manage the `isOpen` state
* no need to think where the `Component` should be written.
* no need to have a component nested behind any inline conditional rendering
* most important -  a single paradigm for handling popups, Modals, Lightboxes, Notifications etc. etc.

## How

### install

```
$ npm i --save react-popup-manager
$ yarn add react-popup-manager
```

### example
Wrap the root of the app with `PopupProvider`

```jsx
// app.jsx
import React from "react";
import ReactDOM from "react-dom";
import { PopupProvider } from "react-popup-manager";
import { Main } from "./Main";

ReactDOM.render(
  <PopupProvider>
    <Main />
  </PopupProvider>,
  document.getElementById("root")
);
```

Use anywhere the hook `usePopupManager` to open a modal

```jsx
// main.jsx
import React from "react";
import { usePopupManager } from "react-popup-manager";
import { MyModal } from './MyModal'

export const Main = () => {
  const popupManager = usePopupManager();
  const openModal = () => {
    // open MyModal with it's needed `props` and an `onClose` callback function
    popupManager.open(MyModal, {
      title: 'my modal',
      onClose: (...params) => console.log('modal has closed with:', ...params), // modal has closed with: param param2 param3
    }); 
  }
  return (
      <div>
        <button onClick={() => openModal()}>
          open modal
        </button>
      </div>
  );
}
```

The `MyModal` Component will recieve the sent `props` and will also have `isOpen` and `onClose` added by the `popupManager`.<br>
`onClose` will trigger the `popupManager` to close the modal

```jsx
// MyModal.jsx
import React from 'react';
import Modal from 'react-modal';

export class MyModal extends React.Component {

    close() {
        // `onClose` will close the modal and will call the callback defined in main.jsx
        this.props.onClose('param', 'param2', 'param3');
    }

    render() {
        // `isOpen` is managed only by 'PopupManager'
        const { isOpen } = this.props;

        return (
            <Modal isOpen={isOpen} >
               <span>{this.props.title}</span>
               <button onClick={() => this.close()}> close </button>
             </Modal>
        );
    }
}
```

The library is agnostic to any popup library you decide to use.
<br>
~ in this example we used `react-modal`

## USAGE

### `PopupProvider`
`PopupProvider` is a `react context provider`. It needs to be rendered on the root of the app.
It will provide the app with `popupManager`.
`props`:
* `popupManager` <i>(optional)</i> - Custom Popup Manager. can send an extended `PopupManager`. <br>
 <i>~ Default : uses `PopupManager`</i>

### `usePopupManager`
react hook that returns `popupManager`

### `withPopups(managerName)`
When using class components, hooks can't be use. <br>
As an alternative, `withPopups` is an HOC that adds `popupManager` to the component's `props`
<br><br>
`parameters`:
* `managerName` <i>(optional)</i> - set manager name that will be added to props.

<i>~ Default : uses `popupManager`</i>

### `PopupManager`
`PopupManager` is a singletone service that manages the state of the popups of the app.<br>
`PopupManager` class can be extended for specific needs (for example: `showToast`, `openConfirmationDialog`)<br>
If not extended, it has 2 methods:
<br><br>
`open(componentClass, popupProps)` - opens popup. render's popup component
* `componentClass` - component's class or function
* `popupProps` <i>(optional)</i> - consumer's popup props and also accepts these:
    * `onClose` - will be called on actual popup close with arguments
     > `isOpen` is not allowed.
* returns - object of instance of open popup
    * `close` - closes the popup

`closeAll()` - closes all open popups. removes popup from DOM
