import '@testing-library/jest-dom'
import React from 'react';

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PopupManager, PopupProps, PopupProvider, usePopupManager } from '../dist';

let renderCounter = 0;

const onCloseSpy = jest.fn();
interface PopupComponentProps {
    customProps: string,
}

function PopupComponent({onCloseClick, show, customProps}: PopupComponentProps & PopupProps){
    renderCounter++;
    if(!show){
        return null;
    } 

    return <div>
        I am a visible popup. Custom Props: {customProps} -
        <button onClick={onCloseClick}>Close Popup</button>
    </div>
}

const SomeContent = () => {
    const popupManager = usePopupManager();
    const open = () => popupManager?.open<PopupComponentProps>(PopupComponent, {
        customProps: 'Montacchiello',
        onCloseClick: onCloseSpy,
    });

    return <div>
        Some random content
        <button onClick={open}>Open popup</button>
    </div>
}

const ComponentHelper = () => {
    const [mounted, setMounted] = React.useState(true)
    const manager = new PopupManager();
    manager.deletionTimeout = 0;
    return <PopupProvider manager={manager}>
        { mounted && <SomeContent />}
        <button onClick={() => setMounted(false)}>Unmount the content</button>
    </PopupProvider>;
}

describe('Popup', () => {
    it('render the PopupComponent 1 time when opened', async () => {
        render(<ComponentHelper/>)

        await userEvent.click(screen.getByText(/Open popup/));
        await userEvent.click(screen.getByText(/Close Popup/));
        await userEvent.click(screen.getByText(/Open popup/));
        await userEvent.click(screen.getByText(/Close Popup/));
        await userEvent.click(screen.getByText(/Open popup/));
        await waitFor(() => {
            expect(renderCounter).toBe(5);
        });
    });

   
    
   
})