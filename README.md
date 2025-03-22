# React Popup Manager &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wix-incubator/typed-locale-keys/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-popup-manager.svg?style=flat)](https://www.npmjs.com/package/react-popup-manager)

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
![](https://user-images.githubusercontent.com/11004313/152688557-044d96d5-5474-464c-9315-edfc36d5a572.png) | ![](https://user-images.githubusercontent.com/11004313/152688627-be0391a9-dd7b-4767-96d0-77f73c5b9216.png)



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

// Your modal component
const MyModal = ({ isOpen, onClose }) => (
  <div>
    <h1>My Modal</h1>
    <button onClick={() => onClose({ success: true })}>
      Close
    </button>
  </div>
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

const ConfirmationModal = ({ isOpen, onClose, message }) => (
  <div>
    <h2>{message}</h2>
    <button onClick={() => onClose({ confirmed: true })}>Yes</button>
    <button onClick={() => onClose({ confirmed: false })}>No</button>
  </div>
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
1. Single argument:
```jsx
// In your modal:
onClose({ data: 'success' });

// In your component:
const { response } = popupManager.open(MyModal);
const result = await response;
console.log(result); // { data: 'success' }
```

2. Multiple arguments:
```jsx
// In your modal:
onClose('success', { meta: true });

// In your component:
const { response } = popupManager.open(MyModal);
const result = await response;
console.log(result); // ['success', { meta: true }]
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
