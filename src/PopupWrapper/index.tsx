import * as React from 'react';
import { PopupProps } from '../models';
import { PopupItem } from '../PopupItem';
import { PopupManager } from '../PopupManager';

interface PopupsWrapperProps {
  popupManager: PopupManager;
}

const useRerender = () => {
    const [_, rerender] = React.useState<any>({});
    return React.useCallback(() => rerender({}), [])
}

function Popup({ show, onClose, currentPopup, ...props}){
    const onCloseClick = React.useCallback((params: any) => {
        return onClose(currentPopup, params)
    }, [onClose, currentPopup])

    return <currentPopup.ComponentClass
        {...props}
        show={show}
        onCloseClick={onCloseClick}
    />
}

export function PopupsWrapper({popupManager}: PopupsWrapperProps){
    const rerender = useRerender();

    React.useEffect(() => {
        popupManager.subscribeOnPopupsChange(rerender);
        return () => popupManager.unsubscribeOnPopupsChange(rerender)
    }, [popupManager, rerender])

    const onClose = React.useCallback(function (currentPopup: PopupItem, params: any) {
        popupManager.close(currentPopup.guid, params);
        const currentPopupProps: PopupProps = currentPopup.props;
        currentPopupProps &&
        currentPopupProps.onCloseClick &&
        currentPopupProps.onCloseClick(params);
      }, [popupManager]);

    return <> 
    { 
        popupManager.popups.map((currentPopup: PopupItem) => (
            <Popup 
                {...currentPopup.props}
                key={currentPopup.guid}
                show={currentPopup.isOpen}
                currentPopup={currentPopup}
                onClose={onClose}
            />
        ))
    }
    </>

}
