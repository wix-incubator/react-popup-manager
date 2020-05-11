import * as React from 'react';
import {configure, mount, ReactWrapper} from 'enzyme';
import {withPopups, PopupManager, PopupProvider} from '..';
import {PopupsDriver} from '../Popups.driver';
import * as Adapter from 'enzyme-adapter-react-16';


export class PopupDriver {
  constructor(private component: ReactWrapper<any>) {
  }

  private getByDataHook(
    hook: string,
    parent: ReactWrapper<any, any> = this.component,
  ): ReactWrapper<any, any> {
    return parent.find(`[data-hook="${hook}"]`);
  }

  public when = {
    closePopup: (): PopupDriver => {
      this.get.closeButton().simulate('click');
      return this;
    },
  };

  public get = {
    exists: () => this.component.exists(),
    isOpen: () => this.component.props()['is-open'],
    closeButton: () => this.getByDataHook('close-button'),
    content: () => this.getByDataHook('popup-content').text(),
  }
}

export class TestPopupsDriver {
  private componentType: React.ComponentType;
  private popupManager: PopupManager;
  private withIsOpen: boolean;
  private popupManagerName: string;
  private component: ReactWrapper<any>;
  private readonly props = {};

  private getPopupsDriver() {
    return new PopupsDriver(this.component);
  }

  private getByDataHook(
    hook: string,
    parent: ReactWrapper<any, any> = this.component,
  ): ReactWrapper<any, any> {
    return parent.find(`[data-hook="${hook}"]`);
  }

  private render(Component: React.ComponentType<any>): ReactWrapper<any> {
    configure({adapter: new Adapter()});
    return mount(<Component {...this.props} />);
  }

  public update() {
    this.component.update();
  }

  public given = {
    withIsOpen: (withIsOpen: boolean): TestPopupsDriver  => {
      this.withIsOpen = withIsOpen;
      return this;
    },
    popupManager: (popupManager: PopupManager, customName?: string): TestPopupsDriver => {
      this.popupManager = popupManager;
      this.popupManagerName = customName;
      return this;
    },
    component: (component: React.ComponentType<any>): TestPopupsDriver => {
      this.componentType = component;
      return this;
    },
  };

  public when = {
    create: (): TestPopupsDriver => {
      this.component = this.render(props => {
        const ComponentWithPopupManager = withPopups(this.popupManagerName)(
          _props1 => <this.componentType {..._props1} />,
        );

        return (
          <PopupProvider
            {...(this.popupManager ? {popupManager: this.popupManager} : null)}
            {...(this.withIsOpen ? {withIsOpen: true} : null)}
          >
            <ComponentWithPopupManager {...props} />
          </PopupProvider>
        );
      });

      return this;
    },
    inGivenComponent: {
      clickOn: (dataHook): TestPopupsDriver => {
        this.getByDataHook(dataHook, this.get.givenComponent()).simulate(
          'click',
        );
        return this;
      },
    },
  };

  public get = {
    givenComponent: () => this.component.find(this.componentType),
    popupDriver: (popupDataHook: string) => new PopupDriver(this.getByDataHook(popupDataHook)),
    isPopupOpen: () => this.getPopupsDriver().get.isAnyPopupsOpen(),
  }
}
