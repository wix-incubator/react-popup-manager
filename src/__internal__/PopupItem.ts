import { PopupProps } from '../popupsDef';

type PopupItemProps = PopupProps & { [key: string]: any };

export class PopupItem {
  private _isOpen: boolean;
  private readonly _response: Promise<any>;
  private _resolve: any;
  private _reject: any;

  constructor(
    public ComponentClass: any,
    public props: PopupItemProps,
    public guid: string,
  ) {
    this._isOpen = true;
    this._response = new Promise(async (resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  public get isOpen() {
    return this._isOpen;
  }

  public get response() {
    return this._response;
  }

  private async resolveResponse(onAfterClose: Function) {
    if (!onAfterClose) {
      this._resolve();
    }

    try {
      this._resolve(await onAfterClose());
    } catch (ex) {
      this._reject(ex);
    }
  }

  public close(onAfterClose?: Function) {
    this._isOpen = false;
    void this.resolveResponse(onAfterClose);
  }
}
