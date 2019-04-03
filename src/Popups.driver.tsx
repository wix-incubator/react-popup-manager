import { ReactWrapper } from 'enzyme';
import { PopupsWrapper } from './PopupsWrapper';

export class PopupsDriver {
  protected component: ReactWrapper<any, any>;

  constructor(root) {
    this.component = root.find(PopupsWrapper);
  }

  public get = {
    isAnyPopupsOpen: () => !this.component.isEmptyRender(),
  };
}
