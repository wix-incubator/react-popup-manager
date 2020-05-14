import { PopupProps } from '../popupsDef';

type PopupItemProps = PopupProps & { [key: string]: any };

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
