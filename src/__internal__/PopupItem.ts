import { PopupAcceptedProps } from '../popupsDef';

export interface popupInstance {
  close: Function;
}

type PopupItemProps = PopupAcceptedProps & { [key: string]: any };

export class PopupItem {
  private _isOpen: boolean;

  constructor(
    public ComponentClass: any,
    public props: PopupItemProps,
    public guid: string,
  ) {
    this._isOpen = true;
  }

  public get isOpen() {
    return this._isOpen;
  }

  public close() {
    this._isOpen = false;
  }
}
