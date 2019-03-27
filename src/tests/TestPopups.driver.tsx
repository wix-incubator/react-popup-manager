import * as React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import { withPopups, PopupManager, PopupProvider } from '..';
import { PopupsDriver } from '../Popups.driver';
import * as Adapter from 'enzyme-adapter-react-16';

export class TestPopupsDriver {
  private componentType: React.ComponentType;
  private popupManager: PopupManager;
  private popupManagerName: string;
  private component: ReactWrapper<any>;
  private readonly props = {};

  private getPopupsDriver() {
    return new PopupsDriver(this.component);
  }

  private render(Component: React.ComponentType<any>): ReactWrapper<any> {
    configure({ adapter: new Adapter() });
    return mount(<Component {...this.props} />);
  }

  private getByDataHook(
    hook: string,
    parent: ReactWrapper<any, any> = this.component,
  ): ReactWrapper<any, any> {
    return parent.find(`[data-hook="${hook}"]`);
  }

  public given = {
    popupManager: (popupManager: PopupManager, customName?: string) => {
      this.popupManager = popupManager;
      this.popupManagerName = customName;
      return this;
    },
    component: (component: React.ComponentType) => {
      this.componentType = component;
      return this;
    },
  };

  public when = {
    create: () => {
      this.component = this.render(props => {
        const ComponentWithPopupManager = withPopups(this.popupManagerName)(
          _props1 => <this.componentType {..._props1} />,
        );

        return (
          <PopupProvider popupManager={this.popupManager}>
            <ComponentWithPopupManager {...props} />
          </PopupProvider>
        );
      });
    },
    testPopup1: {
      closePopup: () => {
        this.get
          .testPopup1()
          .closeButton()
          .simulate('click');
        return this;
      },
    },
    testPopup2: {
      closePopup: () => {
        this.get
          .testPopup2()
          .closeButton()
          .simulate('click');
        return this;
      },
    },
    inGivenComponent: {
      clickOn: dataHook => {
        this.getByDataHook(dataHook, this.get.givenComponent()).simulate(
          'click',
        );
        return this;
      },
    },
  };

  public get = {
    givenComponent: () => this.component.find(this.componentType),
    testPopup1: () => ({
      component: () => this.getByDataHook('test-hook'),
      exists: () =>
        this.get
          .testPopup1()
          .component()
          .exists(),
      closeButton: () =>
        this.getByDataHook('close-button', this.get.testPopup1().component()),
      content: () =>
        this.getByDataHook(
          'popup-content',
          this.get.testPopup1().component(),
        ).text(),
    }),
    testPopup2: () => ({
      component: () => this.getByDataHook('test-hook2'),
      exists: () =>
        this.get
          .testPopup2()
          .component()
          .exists(),
      closeButton: () =>
        this.getByDataHook('close-button', this.get.testPopup2().component()),
    }),
    isPopupOpen: () => this.getPopupsDriver().get.isOpen(),
  };
}
