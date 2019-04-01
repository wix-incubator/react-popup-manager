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

```
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
```
// main.tsx
import { MyModal } from './MyModal'
import { withPopups } from 'react-popup-manager';

@withPopups()
class Main {
    ...
    openModal() {
        this.props.popupManager.open(MyModal);
    }
    ...
}
```

HOC `@withPopups()` adds `popupManager`(or custom name you give as an argument) to `props`
<br><br>
```
// MyModal.tsx
import Modal from 'react-modal';

class MyModal {
    render() {
        return <Modal isOpen={true} >
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
