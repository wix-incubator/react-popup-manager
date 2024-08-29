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

    let result: any;
    let error: any;
    try {
      result = await onAfterClose();
    } catch (ex) {
      error = ex;
    }

    if (error) {
      this._reject(error);
    } else if (result) {
      this._resolve(result);
    } else {
      this._resolve();
    }
  }

  public close(onAfterClose?: Function) {
    this._isOpen = false;
    void this.resolveResponse(onAfterClose);
  }
}
