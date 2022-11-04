import { PopupProps } from '../models';

type PopupItemProps = PopupProps & { [key: string]: any };

export class PopupItem {
  private _isOpen: boolean;
  private _onCloseClickPromise: Promise<any>;
  private _onCloseClickPromiseHandler: {resolve: Function};

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

  public get onCloseClickPromise(): any {
    if(!this._onCloseClickPromise){
      this._onCloseClickPromise = new Promise((resolve) => {
        this._onCloseClickPromiseHandler = {
          resolve,
        }
      })
    }
    return this._onCloseClickPromise;
  }

  public set onCloseClickPromise(cb: (args: any) => any){
    if(!this._onCloseClickPromise){
      this._onCloseClickPromise = new Promise((resolve, reject) => {
        this._onCloseClickPromiseHandler = {
          resolve,
        }
      })
    }
    if(cb){
      this._onCloseClickPromise = this._onCloseClickPromise.then(cb);
    }
  }

  public close(...params: any[]) {
    this._isOpen = false;
    if(this._onCloseClickPromiseHandler){
      this._onCloseClickPromiseHandler.resolve(...params)
    }
  }
}