import * as React from "react"
import { PopupContext } from "../Context"
import { PopupManager } from "../PopupManager"
import { PopupsWrapper } from "../PopupWrapper"

interface PopupProviderProps {
    manager?: PopupManager,
}

export function PopupProvider(
    {manager, children}: React.PropsWithChildren<PopupProviderProps>
){
    const _manager = React.useMemo(() => manager || new PopupManager(), [manager]);
    return <PopupContext.Provider value={{popupManager: _manager}}>
        <PopupsWrapper popupManager={_manager}/>
        {children}
    </PopupContext.Provider>
}