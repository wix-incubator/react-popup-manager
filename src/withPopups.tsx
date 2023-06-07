import * as React from 'react';
import { PopupContext } from './PopupContext';

/**
 adds popupManager to props
 */
export function withPopups(managerName: string = 'popupManager'): any {
  return (WrappedComponent): any => {
    return (props) => {
      return (
        <PopupContext.Consumer>
          {(context) => (
            <WrappedComponent
              {...props}
              {...{ [managerName]: context.popupManager }}
            />
          )}
        </PopupContext.Consumer>
      );
    };
  };
}
