import * as React from 'react';
import { PopupManager } from '../PopupManager';

export const PopupContext = React.createContext<{popupManager?: PopupManager}>({});

export const usePopupManager = () => React.useContext(PopupContext).popupManager;