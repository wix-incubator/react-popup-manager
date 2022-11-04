export interface PopupInstance {
    close: Function;
    onCloseClick: Function;
}

export interface PopupProps {
    onCloseClick: (...args: any[]) => any;
    show: boolean;
}