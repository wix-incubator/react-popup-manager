export interface PopupInstance {
    close: Function;
}

export interface PopupProps {
    onCloseClick?: (...args: any[]) => any;
    show?: boolean;
}