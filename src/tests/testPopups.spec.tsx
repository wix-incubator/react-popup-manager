import {TestPopupsDriver} from './TestPopups.driver';
import {TestPopupsManager} from './testPopupsManager';
import * as React from 'react';
import {generateDataHook, TestPopupUsesIsOpen} from "./TestPopupUsesIsOpen/TestPopupUsesIsOpen";
import {PopupManager} from '../index';
import {usePopupManager} from '../index';

describe('Popups', () => {
  let driver: TestPopupsDriver;
  const buttonOpen = 'button-open';
  let popupManager: PopupManager | TestPopupsManager;

  function justBeforeEachTest({component, popupManager: aPopupManager, popupManagerName}: {component?: React.ComponentType<any>, popupManager?: PopupManager | TestPopupsManager, popupManagerName?: string} = {}) {
    driver = new TestPopupsDriver();
    console.warn = jest.fn();
    popupManager = aPopupManager ? aPopupManager: new PopupManager();

    component && driver.given.component(component);
    driver
      .given.popupManager(popupManager as any, popupManagerName).when.create();
  }

  it('should open popup using default popup manager', () => {
    const testedComponent = (props: { popupManager: PopupManager }) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.open(TestPopupUsesIsOpen)}
        />
      </div>
    );

    justBeforeEachTest({component: testedComponent});

    expect(driver.get.isPopupOpen()).toBe(false);
    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.isPopupOpen()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
  });

  it('should open popup with custom popup manager', () => {
    const testedComponent = (props: { popupManager: TestPopupsManager }) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook())}
        />
      </div>
    );

    justBeforeEachTest({component: testedComponent, popupManager: new TestPopupsManager()});

    expect(driver.get.isPopupOpen()).toBe(false);
    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.isPopupOpen()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
  });

  it('should close popup using open\'s return instance', () => {
    justBeforeEachTest({popupManager: new TestPopupsManager()});
    const dataHook = generateDataHook();
    const testPopup1 = (popupManager as TestPopupsManager).openTestPopup(dataHook);
    driver.update();
    expect(driver.get.popupDriver(dataHook).get.exists()).toBe(true);
    testPopup1.close();
    driver.update();
    expect(driver.get.popupDriver(dataHook).get.isOpen()).toBe(false);
    expect(driver.get.popupDriver(dataHook).get.exists()).toBe(true);
  });

  it('should unmount popup using unmount\'s return instance', () => {
    justBeforeEachTest({popupManager: new TestPopupsManager()});
    const dataHook = generateDataHook();
    const testPopup1 = (popupManager as TestPopupsManager).openTestPopup(dataHook);
    driver.update();
    expect(driver.get.popupDriver(dataHook).get.exists()).toBe(true);
    testPopup1.unmount();
    driver.update();
    expect(driver.get.popupDriver(dataHook).get.exists()).toBe(false);
  });

  it('should unmount popup using "close" and then "unmount" of popup instance', () => {
    justBeforeEachTest({popupManager: new TestPopupsManager()});
    const dataHook = generateDataHook();
    const testPopup1 = (popupManager as TestPopupsManager).openTestPopup(dataHook);
    driver.update();
    expect(driver.get.popupDriver(dataHook).get.exists()).toBe(true);
    testPopup1.close();
    driver.update();
    expect(driver.get.popupDriver(dataHook).get.isOpen()).toBe(false);
    expect(driver.get.popupDriver(dataHook).get.exists()).toBe(true);
    testPopup1.unmount();
    driver.update();
    expect(driver.get.popupDriver(dataHook).get.exists()).toBe(false);
  });

  it('should open popup with custom manager name', () => {
    const customManagerName = 'customName';
    const testedComponent = (props: { [customManagerName]: TestPopupsManager }) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props[customManagerName].openTestPopup(generateDataHook())}
        />
      </div>
    );

    justBeforeEachTest({popupManager: new TestPopupsManager(), popupManagerName: customManagerName, component: testedComponent});

    expect(driver.get.isPopupOpen()).toBe(false);
    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.isPopupOpen()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
  });

  it('should close popup and call callback', () => {
    const onClose = jest.fn();
    const content = 'popup content';
    const testedComponent = (props: { popupManager: TestPopupsManager }) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook(), onClose, content)}
        />
      </div>
    );

    justBeforeEachTest({component: testedComponent, popupManager: new TestPopupsManager()});

    driver.when.inGivenComponent.clickOn(buttonOpen);

    driver.get.popupDriver(generateDataHook()).when.closePopup();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('should close popup with params', () => {
    const onClose = jest.fn();

    justBeforeEachTest({popupManager: new TestPopupsManager()});
    (popupManager as TestPopupsManager).openTestPopup(generateDataHook(), onClose);
    driver.update();
    driver.get.popupDriver(generateDataHook()).when.closePopup();
    expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledWith('value', true, 1);
  });

  it('should pass popup its own props', () => {
    const content = 'popup content';
    justBeforeEachTest({popupManager: new TestPopupsManager()});
    (popupManager as TestPopupsManager).openTestPopup(generateDataHook(), undefined, content);
    driver.update();

    expect(driver.get.popupDriver(generateDataHook()).get.content()).toBe(content);
  });

  it('should have as many popups open in a time', () => {
    justBeforeEachTest({popupManager: new TestPopupsManager()});
    (popupManager as TestPopupsManager).openTestPopup(generateDataHook());
    (popupManager as TestPopupsManager).openTestPopup(generateDataHook(1));
    driver.update();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(true);
  });

    it('should only hide and not remove popup', () => {
      justBeforeEachTest();
      popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook()});
      driver.update();
      expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(true);
      driver.get.popupDriver(generateDataHook()).when.closePopup();
      expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
    });

    it('should allow threshold of 10 closed popups in DOM only. First Closed First Removed', () => {
      justBeforeEachTest();
      const popupThreshold = 10;
      for (let popupDataHookIndex = 0; popupDataHookIndex <= popupThreshold; popupDataHookIndex++) {
        popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook(popupDataHookIndex)});
        driver.update();
        driver.get.popupDriver(generateDataHook(popupDataHookIndex)).when.closePopup();

        expect(driver.get.popupDriver(generateDataHook(popupDataHookIndex)).get.exists()).toBe(true);
        expect(driver.get.popupDriver(generateDataHook(popupDataHookIndex)).get.isOpen()).toBe(false);
      }

      expect(driver.get.popupDriver(generateDataHook(0)).get.exists()).toBe(false);
      expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook(1)).get.isOpen()).toBe(false);
    });

    it('should CLOSE ALL popups. threshold 10. First Closed First Removed', () => {
      justBeforeEachTest();
      const popupThreshold = 10;

      for (let popupDataHookIndex  = 0; popupDataHookIndex  <= popupThreshold; popupDataHookIndex ++) {
        popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook(popupDataHookIndex)});
      }

      popupManager.closeAll();
      driver.update();
      expect(driver.get.popupDriver(generateDataHook(0)).get.exists()).toBe(false);
      for (let popupDataHookIndex  = 1; popupDataHookIndex  <= popupThreshold; popupDataHookIndex ++) {
        expect(driver.get.popupDriver(generateDataHook(popupDataHookIndex)).get.exists()).toBe(true);
        expect(driver.get.popupDriver(generateDataHook(popupDataHookIndex)).get.isOpen()).toBe(false);
      }
    });

  describe('deprecations', () => {
    it('should throw error if user sends `isOpen` to open popupProps', done => {
      justBeforeEachTest();
      try {
        popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook(), isOpen: true} as any)
      } catch (e) {
        expect(e.message).toBe(`it is not allowed to send 'isOpen' in popupProps to 'popupManager.open(component, popupProps)'`);
        done();
      }
    });

    it('should throw error if user sends `isOpen` to open popupProps also if `False`', (done) => {
      justBeforeEachTest();
      try {
        (popupManager as PopupManager).open(TestPopupUsesIsOpen, {dataHook: generateDataHook(), isOpen: false} as any);
      }
      catch (e) {
        expect(e.message).toBe(`it is not allowed to send 'isOpen' in popupProps to 'popupManager.open(component, popupProps)'`);
        done();
      }
    });
  });

  describe('Using React Hooks', () => {
    it('should open popup using default popup manager', () => {
      const testedComponent = () => {
        const {open} = usePopupManager();
        return (<div>
          <button
              data-hook="button-open"
              onClick={() => open(TestPopupUsesIsOpen)}
          />
        </div>);
      };

      justBeforeEachTest({component: testedComponent});

      expect(driver.get.isPopupOpen()).toBe(false);
      driver.when.inGivenComponent.clickOn(buttonOpen);

      expect(driver.get.isPopupOpen()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    });

    it('should close all popups using popup manager', () => {
      const testedComponent = () => {
        const {open, closeAll} = usePopupManager();
        return (<div>
          <button
              data-hook="button-open"
              onClick={() => open(TestPopupUsesIsOpen)}
          />
          <button
              data-hook="button-closeAll"
              onClick={() => closeAll()}
          />
        </div>);
      };

      justBeforeEachTest({component: testedComponent});

      driver.when.inGivenComponent.clickOn(buttonOpen);
      expect(driver.get.isPopupOpen()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(true);

      driver.when.inGivenComponent.clickOn('button-closeAll');
      expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
    });
  });
});
