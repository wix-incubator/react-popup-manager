# react-popup-manager &middot; 
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wix-incubator/react-popup-manager/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/react-popup-manager.svg?style=flat)](https://www.npmjs.com/package/react-popup-manager)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-popup-manager?style=flat-square])](https://travis-ci.org/yjose/react-popup-manager)
[![downloads](https://img.shields.io/npm/dt/react-popup-manager.svg?style=flat-square)](http://www.npmtrends.com/react-popup-manager)

Manage react popups, Modals, Lightboxes, Notifications, etc. easily.

## What
An agnostic react provider that lets you handle opening and closing popups separately from your Component `render` function.

## Why
* No need to manage the `isOpen` state
* No need to think where the `Component` should be written.
* No need to have a component nested behind any inline conditional rendering
* Most important -  a single paradigm for handling popups, Modals, Lightboxes, Notifications etc. etc.
<br>

An example of how using this library will simplify your code

The Old Way                     |  The react-popup-manager Way
:-------------------------:|:-------------------------:
![image](https://github.com/user-attachments/assets/c002d0b7-f29e-4821-a663-c08ee591dcdb) | ![image](https://github.com/user-attachments/assets/7af66386-76e1-44b5-b6ae-33d1c5ff36c5)




## How

### Installation

```bash
npm install react-popup-manager
# or
yarn add react-popup-manager
```

### Usage

#### Basic Example

```jsx
import React from 'react';
import { PopupProvider, usePopupManager } from 'react-popup-manager';
import Modal from 'any-modal-library';

// Your modal component
const MyModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} >
    <h1>My Modal</h1>
    <button onClick={() => onClose({ success: true })}>
      Close
    </button>
  </Modal>
);

// Component that uses the modal
const MyComponent = () => {
  const popupManager = usePopupManager();

  const handleOpenModal = async () => {
    const { response } = popupManager.open(MyModal);
    const result = await response;
    console.log(result); // { success: true }
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
    </div>
  );
};

// Root component with provider
const App = () => (
  <PopupProvider>
    <MyComponent />
  </PopupProvider>
);

export default App;
```

### Advanced Example

```jsx
import React, { useState } from 'react';
import { usePopupManager } from 'react-popup-manager';
import Modal from 'any-modal-library';

const ConfirmationModal = ({ isOpen, onClose, message }) => (
  <Modal isOpen={isOpen} >
    <h2>{message}</h2>
    <button onClick={() => onClose({ confirmed: true })}>Yes</button>
    <button onClick={() => onClose({ confirmed: false })}>No</button>
  </Modal>
);

const TodoList = () => {
  const [todos, setTodos] = useState(['Task 1', 'Task 2']);
  const popupManager = usePopupManager();

  const handleDeleteTodo = async (index) => {
    const { response } = popupManager.open(ConfirmationModal, {
      message: 'Are you sure you want to delete this task?'
    });

    const result = await response;
    if (result.confirmed) {
      setTodos(todos.filter((_, i) => i !== index));
    }
  };

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          {todo}
          <button onClick={() => handleDeleteTodo(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
```

## API

### Hooks

#### usePopupManager()
Returns the popup manager instance with methods to control popups.

```jsx
const popupManager = usePopupManager();
```

### Components

#### PopupProvider
A React context provider that should wrap your application.

```jsx
<PopupProvider>
  <App />
</PopupProvider>
```

### PopupManager Methods

#### open(componentClass, popupProps)
Opens a popup and renders the popup component.

**Parameters:**
* `componentClass`: Component to render
* `popupProps` (optional): Props passed to the popup component
  * `onClose` (deprecated): Legacy callback method, use `response` instead
  > Note: `isOpen` prop is not allowed and will be managed internally

**Returns:**
```typescript
{
  close: (...args: any[]) => void;      // Closes the popup
  unmount: () => void;    // Removes popup from DOM
  response: Promise<any>; // Resolves when popup closes
}
```

**Response Resolution:**
The `response` promise resolves with:
```jsx
// In your modal:
onClose({ data: 'success' });

// In your component:
const { response } = popupManager.open(MyModal);
const result = await response;
console.log(result); // { data: 'success' }
```

#### closeAll()
Closes all open popups.

## Migration Guide

### From Callback to Async/Await

#### Before (Deprecated)
```jsx
const MyComponent = () => {
  const popupManager = usePopupManager();

  const handleOpenModal = () => {
    popupManager.open(MyModal, {
      onClose: (result) => console.log(result)
    });
  };
};
```

#### After (Recommended)
```jsx
const MyComponent = () => {
  const popupManager = usePopupManager();

  const handleOpenModal = async () => {
    const { response } = popupManager.open(MyModal);
    const result = await response;
    console.log(result);
  };
};
```

## License

MIT
