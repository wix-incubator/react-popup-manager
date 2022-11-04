import '@testing-library/jest-dom'
import React from 'react';

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PopupProps, PopupProvider, usePopupManager } from '../dist';

const onCloseSpy = jest.fn();
const onClosePromiseLikeSpy = jest.fn(x => x+'extra_data');
interface PopupComponentProps {
    customProps: string,
}

const PopupComponent = function({onCloseClick, show, customProps}: PopupComponentProps & PopupProps){
    if(!show){
        return null;
    } 

    return <div>
        I am a visible popup. Custom Props: {customProps} -
        <button onClick={() => onCloseClick('first popup result')}>Close Popup</button>
    </div>
}

const SomeContent = () => {
    const popupManager = usePopupManager();
    const open = async () => {
        let result = await (popupManager?.open<PopupComponentProps>(PopupComponent, {
            customProps: 'Montacchiello',
            onCloseClick: onCloseSpy,
        })
        .onCloseClick(onClosePromiseLikeSpy));

        
        popupManager?.open<PopupComponentProps>(PopupComponent, {
            customProps: result,
            onCloseClick: onCloseSpy,
        });
    }

    return <div>
        Some random content
        <button onClick={open}>Open popup</button>
    </div>
}

const ComponentHelper = () => {
    return <PopupProvider>
        <SomeContent />
    </PopupProvider>;
}

describe('manager.open().onCloseClick function', () => {
    it('render children of the Provider', () => {
        render(<ComponentHelper/>)

        expect(screen.getByText(/Some random content/)).toBeInTheDocument();
    });

    it('Can close the popup, setting .onCloseClick chaining and await it to open a new popup', async () => {
        render(<ComponentHelper/>);
        await userEvent.click(screen.getByText(/Open popup/));
        
        expect(await screen.findByText(/I am a visible popup\. Custom Props: Montacchiello/)).toBeInTheDocument();
        onCloseSpy.mockClear();
        await userEvent.click(screen.getByText(/Close Popup/));
        expect(onCloseSpy).toHaveBeenCalledTimes(1);
        expect(onClosePromiseLikeSpy).toHaveBeenCalledTimes(1);
        
        expect(screen.queryByText(/I am a visible popup\. Custom Props: Montacchiello/)).not.toBeInTheDocument();
        expect(await screen.findByText(/I am a visible popup. Custom Props: first popup resultextra_data/)).toBeInTheDocument();
    });
    
    

})