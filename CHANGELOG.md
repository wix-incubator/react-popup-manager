# Changelog
All notable changes to this project will be documented in this file.


## [2.2.0] - 2024-08-29
### Added
- New Promise-based API: Added `response` to the return value of `open` method
  ```typescript
  const { response } = popupManager.open(MyModal);
  const result = await response;
  ```
- Improved handling of popup results:
  - Single argument is returned directly: `onClose({ data: 'value' })` → `const result = await response; // { data: 'value' }`
  - Multiple arguments preserved as array: `onClose(arg1, arg2)` → `const [arg1, arg2] = await response;`

### Deprecated
- `onClose` callback in `popupProps` is now deprecated in favor of using the `response` promise
  ```typescript
  // Instead of
  popupManager.open(MyModal, {
    onClose: (result) => console.log(result)
  });

  // Use
  const { response } = popupManager.open(MyModal);
  const result = await response;
  console.log(result);
  ```

## [2.1.7] - 2024-01-31
### Added
- `unmount` - `popupManager.open(Modal)` returns an object that now also has `unmount` function that removes popup's instance. <br>
  This fixes an [issue](https://github.com/wix-incubator/react-popup-manager/issues/19) of code still running after popup was closed.
### Fixed
- `popupManager`'s `onClose` doesn't init a new function on every render.

## [2.0.30] - 2021-04-05
### Added
- `usePopupManager` - add support for react-hooks

## [2.0.0] - 2020-05-14
### Fixed
- Transitions on show and hide were fixed! <br>
  There was an issue with the current approach to show and hide popups.<br>
  It added and removed dom elements, preventing the in-code transition solution of external popup-libraries.<br>
  ><i>for example: instead of fade out, it used to just disappear</i>
### Changed
- Changed `PopupManager` `close` approach:<br>
  Instead of adding and removing it from the DOM, it changes popup's `isOpen` prop.<br>
  This will allow in-library implemented transitions on `Open` and on `Close`.<br>
  > there is a threshold of closed popups.
### Added
to get the upgrade features that fix the animation issue you need to use these:
- `isOpen` - new `Prop` added to existing `PopupProps`. <br>
  The `props` that are added to consumers popup when calling `popupManager.open()` function.<br>
 
  >:warning:&nbsp;**Important** - &nbsp; must use in consumers popup otherwise it will never close

### Deprecated
- `popupProps.isOpen` in `PopupManager.open(component, popupProps)`  - is not allowed. is saved for internal use.
  >:warning:&nbsp;**Important** - &nbsp; will throw exception if added
- `PopupManager.openPopups`  - for internal use only and will be removed in the future.
- `PopupManager.onPopupsChangeEvents`  - for internal use  only and will be removed in the future.
- `PopupManager.subscribeOnPopupsChange`  - for internal use  only and will be removed in the future.
- `PopupManager.close`  - for internal use  only and will be removed in the future.
