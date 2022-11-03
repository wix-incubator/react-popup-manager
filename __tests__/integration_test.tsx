import '@testing-library/jest-dom'
import React from 'react';

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PopupProps, PopupProvider, usePopupManager } from '..';

const onCloseSpy = jest.fn();
interface PopupComponentProps {
    customProps: string,
}

const PopupComponent = function({onCloseClick, show, customProps}: PopupComponentProps & PopupProps){
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
    return <PopupProvider>
        { mounted && <SomeContent />}
        <button onClick={() => setMounted(false)}>Unmount the content</button>
    </PopupProvider>;
}

describe('Popup', () => {
    it('render children of the Provider', () => {
        render(<ComponentHelper/>)

        expect(screen.getByText(/Some random content/)).toBeInTheDocument();
    });

    it('Can open the popup', async () => {
        render(<ComponentHelper/>);
        expect(screen.queryByText(/I am a visible popup/)).not.toBeInTheDocument();
        await userEvent.click(screen.getByText(/Open popup/));

        expect(await screen.findByText(/I am a visible popup\. Custom Props: Montacchiello/)).toBeInTheDocument();
    });
    
    it('Can close the popup', async () => {
        render(<ComponentHelper/>);
        await userEvent.click(screen.getByText(/Open popup/));
        
        expect(await screen.findByText(/I am a visible popup\. Custom Props: Montacchiello/)).toBeInTheDocument();
        onCloseSpy.mockClear();
        await userEvent.click(screen.getByText(/Close Popup/));
        expect(onCloseSpy).toHaveBeenCalledTimes(1);
        
        expect(screen.queryByText(/I am a visible popup/)).not.toBeInTheDocument();
    });
    
    it('The popup remains visible even if the caller component is unmounted and then can be closed', async () => {
        render(<ComponentHelper/>);
        await userEvent.click(screen.getByText(/Open popup/));
        
        expect(await screen.findByText(/I am a visible popup\. Custom Props: Montacchiello/)).toBeInTheDocument();
        await userEvent.click(screen.getByText(/Unmount the content/));
        
        expect(screen.queryByText(/Some random content/)).not.toBeInTheDocument();
        expect(await screen.findByText(/I am a visible popup\. Custom Props: Montacchiello/)).toBeInTheDocument();
        
        await userEvent.click(screen.getByText(/Close Popup/));
        expect(screen.queryByText(/I am a visible popup\. Custom Props: Montacchiello/)).not.toBeInTheDocument();
    })

})