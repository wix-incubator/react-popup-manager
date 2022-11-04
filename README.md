# react-popup-manager &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wix-incubator/typed-locale-keys/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-popup-manager.svg?style=flat)](https://www.npmjs.com/package/react-popup-manager)

Manage react popups, Modals, Lightboxes, Notifications etc. 

# Now in React 18!

# Main difference with the react-popup-manager v2.1.1
* The new version runs in React 18 using Functional Component as internal implementation.
* The isOpen property has been replaced by `show` property.
* The onClose property has been replaced by `onCloseClick` property.
* withPopups has been removed. Feel free to submit a PR to re-add it.

## What
An agnostic react provider that lets you handle opening and closing popups separately from you're Component `render` function.

## Why
* No need to manage the `show` state
* No need to think where the `Component` should be written.
* No need to have a component nested behind any inline conditional rendering
* Most important -  a single paradigm for handling popups, Modals, Lightboxes, Notifications etc. etc.
<br>

An example of how using this library will simplify your code (it uses a slightly different API, please check latest version below)

The Old Way                     |  The react-popup-manager Way
:-------------------------:|:-------------------------:
![](https://user-images.githubusercontent.com/11004313/152688557-044d96d5-5474-464c-9315-edfc36d5a572.png) | ![](https://user-images.githubusercontent.com/11004313/152688627-be0391a9-dd7b-4767-96d0-77f73c5b9216.png)



## How

### install

```
$ npm i --save react-popup-manager
$ yarn add react-popup-manager
```

### example
Here is a simple example of how to use `react-popup-manager`
<br><br>
Wrap the root of the app with `PopupProvider`

```jsx
// app.jsx
import React from "react";
import { createRoot } from 'react-dom/client'
import { PopupProvider } from "react-popup-manager";
import { Main } from "./Main";

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <PopupProvider>
    <Main />
  </PopupProvider>,
);
```

Use the hook `usePopupManager` to open a modal

```jsx
// main.jsx
import React from "react";
import { usePopupManager } from "react-popup-manager";
import { MyModal } from './MyModal'

export const Main = () => {
  const popupManager = usePopupManager();
  const openModal = async () => {
    // open MyModal with it's needed `props` and an `onCloseClick` callback function
    let result = await popupManager.open(MyModal, {
      title: 'my modal',
    }).onCloseClick((...params) => 'modal has closed with:', ...params);
    console.log(result) // 'modal has closed with: param, param2, param3'
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

The modal Component will recieve the sent `props` and will also have `show` and `onCloseClick` added by the `popupManager`.<br>
`onCloseClick` will trigger the `popupManager` to close the modal

```jsx
// MyModal.jsx
import React from 'react';
import Modal from 'react-modal';

export function MyModal({show, onCloseClick, title}) {

    const close = () => onCloseClick('param', 'param2', 'param3');

    return (
        <Modal show={show} >
          <span>{title}</span>
          <button onClick={close}> close </button>
        </Modal>
    );
}
```

The library is agnostic to any popup library you decide to use.
<br>
~ you only need to wrap your component in case property different than `show` and `onCloseClick` are used to handle the popup visibility.

## API

### `PopupProvider`
A react context provider, should wrap the root of the app in order to provide the `popupManager`. <br>
`props`:
* `popupManager` <i>(optional)</i> - Custom Popup Manager. can send an extended `PopupManager`. <br>
 <i>~ Default : uses `PopupManager`</i>

### `usePopupManager`
React hook that returns `popupManager`.
For class components, check the `withPopups` HOC below


### `PopupManager`
A singletone service that manages the state of the popups of the app.<br>
Can be extended for specific needs (<i>for example: `showToast`, `openConfirmationDialog`</i>)<br>
If not extended, it has 2 methods:
<br><br>
`open(Component, popupProps)` - opens popup. render's popup component
* `Component` - component's class or function
* `popupProps` <i>(optional)</i> - consumer's popup props and also accepts these:
    * `onClose` - will be called on actual popup close with arguments
     > `isOpen` is not allowed.
* returns - object of instance of open popup
    * `close` - closes the popup

`closeAll()` - closes all open popups.
