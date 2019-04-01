import { TestPopupsDriver } from './TestPopups.driver';
import { TestPopupsManager } from './testPopupsManager';
import * as React from 'react';
import {TestPopup1} from "./testPopups";

describe('Popups', () => {
  let driver: TestPopupsDriver;
  let popupManager: TestPopupsManager;
  const buttonOpen = 'button-open';

  beforeEach(() => {
    driver = new TestPopupsDriver();
    popupManager = new TestPopupsManager();
  });

  it('should open popup using default popup manager', () => {
    const testedComponent = props => (
        <div>
          <button
              data-hook="button-open"
              onClick={() => props.popupManager.open(TestPopup1)}
          />
        </div>
    );

    driver.given.component(testedComponent);

    driver.when.create();

    expect(driver.get.isPopupOpen()).toBe(false);
    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.isPopupOpen()).toBe(true);
    expect(driver.get.testPopup1().exists()).toBe(true);
  });

  it('should open popup with custom popup manager', () => {
    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup1()}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    expect(driver.get.isPopupOpen()).toBe(false);
    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.isPopupOpen()).toBe(true);
    expect(driver.get.testPopup1().exists()).toBe(true);
  });

  it('should open popup with custom manager name', () => {
    const customManagerName = 'customName';
    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props[customManagerName].openTestPopup1()}
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
    expect(driver.get.testPopup1().exists()).toBe(true);
  });

  it('should close popup and call callback', () => {
    const onClose = jest.fn();
    const content = 'popup content';

    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup1(onClose, content)}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);

    driver.when.testPopup1.closePopup();
    expect(driver.get.testPopup1().exists()).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('should pass popup its own props', () => {
    const content = 'popup content';

    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup1(undefined, content)}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);

    expect(driver.get.testPopup1().content()).toBe(content);
  });

  it('should have as many popups open in a time', () => {
    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup1()}
        />
        <button
          data-hook="button-open2"
          onClick={() => props.popupManager.openTestPopup2()}
        />
      </div>
    );

    driver.given.popupManager(popupManager).given.component(testedComponent);

    driver.when.create();

    driver.when.inGivenComponent.clickOn(buttonOpen);
    driver.when.inGivenComponent.clickOn('button-open2');
    expect(driver.get.testPopup1().exists()).toBe(true);
    expect(driver.get.testPopup2().exists()).toBe(true);
  });

  it('should allow close all popups', () => {
    const testedComponent = props => (
      <div>
        <button
          data-hook="button-open"
          onClick={() => props.popupManager.openTestPopup1()}
        />
        <button
          data-hook="button-open2"
          onClick={() => props.popupManager.openTestPopup2()}
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
    expect(driver.get.testPopup1().exists()).toBe(true);
    expect(driver.get.testPopup2().exists()).toBe(true);
    driver.when.inGivenComponent.clickOn('button-close-all');
    expect(driver.get.testPopup1().exists()).toBe(false);
    expect(driver.get.testPopup2().exists()).toBe(false);
  });
});
