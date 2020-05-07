import { TestPopupsDriver } from './TestPopups.driver';
import { TestPopupsManager } from './testPopupsManager';
import * as React from 'react';
import {TestPopup } from "./testPopups";
import {PopupManager} from '../popupManager';

describe('Popups', () => {
  let driver: TestPopupsDriver;
  let popupManager: TestPopupsManager;
  const buttonOpen = 'button-open';
  const generateDataHook = (index = 0) =>  `test-popup-${index}`;

  beforeEach(() => {
    driver = new TestPopupsDriver();
    popupManager = new TestPopupsManager();
  });

  it('should open popup using default popup manager', () => {
    const testedComponent = (props:{popupManager: PopupManager}) => (
        <div>
          <button
              data-hook="button-open"
              onClick={() => props.popupManager.open(TestPopup, {dataHook: generateDataHook(), content: ''})}
          />
        </div>
    );

    driver.given.component(testedComponent);

    driver.when.create();

    expect(driver.get.isPopupOpen()).toBe(false);
    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.isPopupOpen()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
  });

  it('should open popup with custom popup manager', () => {
    const testedComponent = (props: {popupManager: TestPopupsManager}) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook())}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    expect(driver.get.isPopupOpen()).toBe(false);
    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.isPopupOpen()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
  });

  it('should close popup using open\'s return instance', () => {
    const testedComponent = () => (
        <div>
          nada
        </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    const testPopup1 = popupManager.openTestPopup(generateDataHook());
    driver.update();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    testPopup1.close();
    driver.update();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
  });

  it('should open popup with custom manager name', () => {
    const customManagerName = 'customName';
    const testedComponent = (props: {[customManagerName]: TestPopupsManager}) => (
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

    const testedComponent = (props: {popupManager: TestPopupsManager}) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook(), onClose, content)}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);

    driver.get.popupDriver(generateDataHook()).when.closePopup();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

 it('should close popup with params', () => {
    const onClose = jest.fn();

    const testedComponent = (props: {popupManager: TestPopupsManager}) => (
        <div>
          <button
              data-hook="button-open"
              onClick={() => props.popupManager.openTestPopup(generateDataHook(), onClose)}
          />
        </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);

    driver.get.popupDriver(generateDataHook()).when.closePopup();
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
    expect(onClose).toHaveBeenCalledWith('value', true, 1);
  });

  it('should pass popup its own props', () => {
    const content = 'popup content';

    const testedComponent = (props: {popupManager: TestPopupsManager}) => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook(), undefined, content)}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.popupDriver(generateDataHook()).get.content()).toBe(content);
  });

  it('should have as many popups open in a time', () => {
    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook())}
        />
        <button
          data-hook="button-open2"
          onClick={() => props.popupManager.openTestPopup(generateDataHook(1))}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);
    driver.when.inGivenComponent.clickOn('button-open2');
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(true);
  });

  it('should allow close all popups', () => {
    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup(generateDataHook())}
        />
        <button
          data-hook="button-open2"
          onClick={() => props.popupManager.openTestPopup(generateDataHook(1))}
        />
        <button
          data-hook="button-close-all"
          onClick={() => props.popupManager.closeAll()}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);
    driver.when.inGivenComponent.clickOn('button-open2');
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(true);
    expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(true);
    driver.when.inGivenComponent.clickOn('button-close-all');
    expect(driver.get.popupDriver(generateDataHook()).get.exists()).toBe(false);
    expect(driver.get.popupDriver(generateDataHook(1)).get.exists()).toBe(false);
  });
});
