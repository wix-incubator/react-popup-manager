# react-popup-manager
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

```javascript
// app.tsx
import { PopupProvider } from 'react-popup-manager';
import * as ReactDOM from 'react-dom';

ReactDOM.render(
        <PopupProvider>
            <Main/>
        </PopupProvider>,
        document.getElementById("root")
    );


// main.tsx
import { MyModal } from './MyModal'
import { withPopups } from 'react-popup-manager';

@withPopups() // adds 'popupManager' to props
class Main {
    ...
    openModal() {
        this.props.popupManager.open(MyModal, {title: 'my modal', onClose: () => console.log('modal has closed')});
    }
    ...
}

// MyModal.tsx
import Modal from 'react-modal';

class MyModal {

    close() {
        // `onClose` is added by 'PopupManager' to props
        this.props.onClose();
    }

    render() {
        return <Modal isOpen={true} >
                        <span>{this.props.title}</span>
                        <button onClick={() => this.close()}
                </Modal>;
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

### `@withPopups(managerName)`
HOC that adds `popupManager` to `props` of component
<br><br>
`parameters`:
* `managerName` <i>(optional)</i> - set manager name that will be added to props.

<i>~ Default : uses `popupManager`</i>

### `PopupManager`
`open(componentClass, popupProps)`
* `componentClass` - component's class or function
* `popupProps` <i>(optional)</i> - popup's props.
    * `onClose` - will be called on actual popup close

`closeAll()` - closes all open popups
