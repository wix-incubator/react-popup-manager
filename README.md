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

### some code

// app.ts

`PopupProvider` can receive a custom extended `PopupManager` with your custom functions (for example: `openDeletePrompt()`).
<br><br>
By default it will initialize `PopupManager`

```
import { PopupProvider } from 'react-popup-manager';

<PopupProvider>
    <Main/>
</PopupProvider>
```


// main.tsx

HOC `@withPopups()` adds `popupManager`(or custom name you give as an argument) to `props`

```
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


// MyModal.tsx

When opening popup with `popupManager.open(MyModal)`, it passes prop `onClose`,
to close oneself.
<br>
This library is agnostic to any use of popup library you decide to use.
<br>
~ in this example we will use `react-modal`

```
import Modal from 'react-modal';

class MyModal {
    render() {
        return <Modal isOpen={true} >
                            <button onClick={() => this.props.onClose()}
                    </Modal>;
    }
}

```
