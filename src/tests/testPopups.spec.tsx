import {TestPopupsDriver} from './TestPopups.driver';
import {TestPopupsManager} from './testPopupsManager';
import * as React from 'react';
import {TestPopup, TestPopupUsesIsOpen} from "./testPopups";
import {PopupManager} from '../popupManager';
import {PopupManagerInternal} from '../__internal__/popupManagerInternal';
import {deprecatedPropWarningMessage, deprecatedWarningMessage} from '../__internal__/common';

describe('Popups', () => {
  let driver: TestPopupsDriver;
  const buttonOpen = 'button-open';
  const generateDataHook = (index = 0) => `test-popup-${index}`;
  let popupManager: PopupManager;

  function justBeforeEachTest({withIsOpen, component, popupManager: aPopupManager}: {withIsOpen?: boolean, component?: React.ComponentType<any>, popupManager?: PopupManager | TestPopupsManager} = {}) {
    driver = new TestPopupsDriver();
    console.warn = jest.fn();
    popupManager = aPopupManager ? aPopupManager: new PopupManager();

    component && driver.given.component(component);
    driver
      .given.withIsOpen(withIsOpen)
      .given.popupManager(popupManager as any).when.create();
  }

  it('should open popup using default popup manager', () => {
    const testedComponent = (props: { popupManager: PopupManager }) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.open(TestPopup, {dataHook: generateDataHook(), content: ''})}
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
    const testPopup1 = (popupManager as TestPopupsManager).openTestPopup(generateDataHook());
    driver.update();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    testPopup1.close();
    driver.update();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
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

    driver.given
      .popupManager(popupManager, customManagerName)
      .given.component(testedComponent);

    driver.when.create();

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
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('should close popup with params', () => {
    const onClose = jest.fn();

    const testedComponent = (props: { popupManager: TestPopupsManager }) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook(), onClose)}
        />
      </div>
    );

    justBeforeEachTest({component: testedComponent, popupManager: new TestPopupsManager()});

    driver.when.inGivenComponent.clickOn(buttonOpen);

    driver.get.popupDriver(generateDataHook()).when.closePopup();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
    expect(onClose).toHaveBeenCalledWith('value', true, 1);
  });

  it('should pass popup its own props', () => {
    const content = 'popup content';
    const testedComponent = (props: { popupManager: TestPopupsManager }) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook(), undefined, content)}
        />
      </div>
    );

    justBeforeEachTest({component: testedComponent, popupManager: new TestPopupsManager()});

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);

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

  it('should allow close all popups', () => {
    const testedComponent = props => (
      <div>
        <button
          data-hook="button-close-all"
          onClick={() => props.popupManager.closeAll()}
        />
      </div>
    );
    justBeforeEachTest({popupManager: new TestPopupsManager(),component: testedComponent});
    (popupManager as TestPopupsManager).openTestPopup(generateDataHook());
    (popupManager as TestPopupsManager).openTestPopup(generateDataHook(1));
    driver.update();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(true);
    driver.when.inGivenComponent.clickOn('button-close-all');
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
    expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(false);
  });

  describe('with `isOpen` for transitions', () => {
    it('should only hide and not remove popup', () => {
      justBeforeEachTest({withIsOpen: true});
      popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook()});
      driver.update();
      expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(true);
      driver.get.popupDriver(generateDataHook()).when.closePopup();
      expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
    });

    it('should NOT override isOpen of consumer props', () => {
      justBeforeEachTest({withIsOpen: false});
      popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook(), isOpen: false});
      driver.update();
      expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
    });

    it('should allow threshold of 10 closed popups in DOM only. First Closed First Removed', () => {
      justBeforeEachTest({withIsOpen: true});
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

    it('should close all popups. threshold 10. First Closed First Removed', () => {
      justBeforeEachTest({withIsOpen: true});
      const popupThreshold = 10;

      for (let popupDataHookIndex  = 0; popupDataHookIndex  <= popupThreshold; popupDataHookIndex ++) {
        popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook(popupDataHookIndex)});
      }

      popupManager.closeAll();
      driver.update();
      expect(driver.get.popupDriver(generateDataHook(0)).get.exists()).toBe(false);
      expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(true);
      expect(driver.get.popupDriver(generateDataHook(1)).get.isOpen()).toBe(false);
    });
  });

  describe('deprecations', () => {
    it('should console.war on using deprecated message', () => {
      justBeforeEachTest({withIsOpen: true});
      // all should be strikethrough
      popupManager.close('guid');
      popupManager.onPopupsChangeEvents;
      popupManager.openPopups;
      popupManager.subscribeOnPopupsChange(() => ({}));

      expect(console.warn).toBeCalledWith(deprecatedWarningMessage('close'));
      expect(console.warn).toBeCalledWith(deprecatedWarningMessage('onPopupsChangeEvents'));
      expect(console.warn).toBeCalledWith(deprecatedWarningMessage('openPopups'));
      expect(console.warn).toBeCalledWith(deprecatedWarningMessage('subscribeOnPopupsChange'));
    });

    it('should NOT console.war on using deprecated message when it is PopupManager for Internal usage', () => {
      justBeforeEachTest({withIsOpen: true});
      const popupManagerInternal: PopupManagerInternal = popupManager as any;

      // all shouldn't be strikethrough
      popupManagerInternal._close('guid');
      popupManagerInternal._onPopupsChangeEvents;
      popupManagerInternal.popups;
      popupManagerInternal._subscribeOnPopupsChange(() => ({}));

      expect(console.warn).not.toBeCalled();
    });


    it('should console.warn if user sends `isOpen` to open props when `withIsOpen` is false', () => {
      justBeforeEachTest({withIsOpen: false});
      popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook(), isOpen: true});

      expect(console.warn).toBeCalledWith(deprecatedPropWarningMessage('isOpen'));
    });

    it('should throw error if user sends `isOpen` to open props when `withIsOpen` as false', done => {
      justBeforeEachTest({withIsOpen: true});

      try {
        popupManager.open(TestPopupUsesIsOpen, {dataHook: generateDataHook(), isOpen: true})
      } catch (e) {
        expect(e.message).toBe(`'isOpen' prop is deprecated and not allowed. if you wish to use it, remove 'withIsOpen' from 'PopupProvider'`);
        done();
      }
    });
  });
});
