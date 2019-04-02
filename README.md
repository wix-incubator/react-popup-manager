# react-popup-manager
Manage react popups, Modals, Lightboxes, Notifications etc.

## What
an agnostic react provider that lets you handle opening and closing popups separately from you're Component `render` function.

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

```javascript
// app.ts
import { PopupProvider } from 'react-popup-manager';

<PopupProvider>
    <Main/>
</PopupProvider>
```

`PopupProvider` can receive a custom extended `PopupManager` with your custom functions (for example: `openDeletePrompt()`) as a prop (`popupManager={myCustomPopupManager}`).
<br>
~ By default it will initialize `PopupManager` by it self
<br><br>
```javascript
// main.tsx
import { MyModal } from './MyModal'
import { withPopups } from 'react-popup-manager';

@withPopups()
class Main {
    ...
    openModal() {
        this.props.popupManager.open(MyModal, {title: 'my modal', onClose: () => console.log('modal has closed')});
    }
    ...
}
```

HOC `@withPopups()` adds `popupManager` to `props`
<br><br>
`@withPopups([managerName])` - accepts name that will be instead of `popupManager`
<br>
`popupManager.open(componentClass[, props])`-  accepts `componentClass` and `props` (`onClose` will be called on actual popup close)
<br><br>
```javascript
// MyModal.tsx
import Modal from 'react-modal';

class MyModal {
    render() {
        return <Modal isOpen={true} >
                        <span>{this.props.title}</span>
                        <button onClick={() => this.props.onClose()}
                </Modal>;
    }
}

```

When opening popup with `popupManager.open(MyModal)`, it passes prop `onClose`,
to close oneself.
<br>
The library is agnostic to any popup library you decide to use.
<br>
~ in this example we used `react-modal`
