import * as React from 'react';
import {configure, mount, ReactWrapper} from 'enzyme';
import {withPopups, PopupManager, PopupProvider} from '..';
import {PopupsDriver} from '../Popups.driver';
import * as Adapter from 'enzyme-adapter-react-16';
import {TestPopupUsesIsOpenDriver} from "./TestPopupUsesIsOpen/TestPopupUsesIsOpen.driver";
import {getByDataHook} from "./getByDataHook";

export class TestPopupsDriver {
  private componentType: React.ComponentType;
  private popupManager: PopupManager;
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
    return getByDataHook(parent,hook);
  }

  private render(Component: React.ComponentType<any>): ReactWrapper<any> {
    configure({adapter: new Adapter()});
    return mount(<Component {...this.props} />);
  }

  public update() {
    this.component.update();
  }

  public given = {
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
      this.componentType = this.componentType ? this.componentType : () => <div></div>;
      this.component = this.render(props => {
        const ComponentWithPopupManager = withPopups(this.popupManagerName)(
          _props1 => <this.componentType {..._props1} />,
        );

        return (
          <PopupProvider
            {...(this.popupManager ? {popupManager: this.popupManager} : null)}
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
    popupDriver: (popupDataHook: string) => new TestPopupUsesIsOpenDriver(this.getByDataHook(popupDataHook)),
    isPopupOpen: () => this.getPopupsDriver().get.isAnyPopupsOpen(),
  }
}
