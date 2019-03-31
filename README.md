# react-popup-manager
Manage react popups, Modals, Lightboxes, Notifications etc.

## What
this is a react provider, that lets you handle opening and closing separately from you're Component `render ` function.

## Why
* no need to manage the `isOpen` state
* no need to think where the `Component` should be written.
* no need to have component nested behind any inline conditional rendering
* most important, a single paradigm for handling popups, Modals, Lightboxes, Notifications etc. etc.

## How
// app.ts

initialize `PopupManager`, or extend `PopupManager` with your custom methods(`openDeletePrompt()`)

```
import { PopupProvider, PopupManager } from 'react-popup-manager';

const popupManager = new PopupManager();
<PopupProvider popupManager={popupManager}>
    <Main/>
</PopupProvider>
```


// main.tsx

HOC `@withPopups` adds `popupManager`(or custom name you give as argument)

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

when opening modal with `popupManager.open(MyModal)`, it passes prop `onClose`,
to close one self

```
class MyModal {
    render() {
    return <GenericModalYouUse
            isOpen >
            <button onclick={() => this.props.onClose()}
            </GenericModalYouUse>
    }
}

```
