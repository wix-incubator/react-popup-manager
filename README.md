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

### usage

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


// main.jsx
import React from "react";
import { withPopups } from "react-popup-manager";
import { MyModal } from './MyModal'

class Main extends React.Component {
  openModal() {
    this.props.popupManager.open(MyModal, {title: 'my modal', onClose: (...params) => console.log('modal has closed with:', ...params)}); // modal has closed with: param param2 param3
  }
  render() {
    return <button onClick={() => this.openModal()}> open modal </button>;
  }
}

const wrappedMain = withPopups()(Main); // adds 'popupManager' to props
export {wrappedMain as Main};


// MyModal.jsx
import React from 'react';
import Modal from 'react-modal';

export class MyModal extends React.Component {

    close() {
        // `onClose` is added by 'PopupManager' to props
        this.props.onClose('param', 'param2', 'param3');
    }

    render() {
        return (
            <Modal isOpen={true} >
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

## API

### `PopupProvider`
`props`:
* `popupManager` <i>(optional)</i> - Popup Manager. can send custom extended `PopupManager`. <br>
 <i>~ Default : uses `PopupManager`</i>

### `withPopups(managerName)`
HOC that adds `popupManager` to `props` of component
<br><br>
`parameters`:
* `managerName` <i>(optional)</i> - set manager name that will be added to props.

<i>~ Default : uses `popupManager`</i>

### `PopupManager`
`open(componentClass, popupProps)` - opens popup. render's popup component
* `componentClass` - component's class or function
* `popupProps` <i>(optional)</i> - popup's props.
    * `onClose` - will be called on actual popup close with arguments
* returns - object of open popup
    * `close` - closes the popup

`closeAll()` - closes all open popups. removes popup from DOM
