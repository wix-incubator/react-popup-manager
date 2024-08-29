import * as React from 'react';
import {generateDataHook, TestPopupUsesIsOpen} from "../TestPopupUsesIsOpen/TestPopupUsesIsOpen";
import {PopupManager} from "../../popupManager";
import {TestPopupsDriver} from "../TestPopups.driver";

describe('TestPopupUsesIsOpen', () => {
        let driver: TestPopupsDriver;
        const buttonOpenDataHook = 'button-open';

        it('should return "response" of consumer\'s "onClose" override with SYNCHRONOUS function', async () => {
            const popupManager = new PopupManager();
            let responsePromise: Promise<any>;
            const expectedResponse = 'expectedResponseForOnCloseOverride';
            const onClick = () => {
                const {response} = popupManager.open(TestPopupUsesIsOpen, {
                    onClose: () => {
                        return expectedResponse;
                    }
                });
                responsePromise = response;
            }

            const testedComponent = () => (
                <div>
                    <button
                        data-hook={buttonOpenDataHook}
                        onClick={onClick}
                    />
                </div>
            );

            driver = new TestPopupsDriver();
            driver.given.component(testedComponent).given.popupManager(popupManager);
            driver.when.create();

            driver.when.inGivenComponent.clickOn(buttonOpenDataHook);

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(generateDataHook()).when.closePopup();
            expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
            expect(await responsePromise).toBe(expectedResponse);
        });

    it('should return "response" of consumer\'s "onClose" override with ASYNCHRONOUS function', async () => {
        const popupManager = new PopupManager();
        let responsePromise: Promise<any>;
        const expectedResponse = 'expectedResponseForOnCloseOverride';
        const onClick = () => {
            const {response} = popupManager.open(TestPopupUsesIsOpen, {
                onClose: () => {
                    return new Promise(resolve => setTimeout(() => resolve(expectedResponse), 100));
                }
            });
            responsePromise = response;
        }

        const testedComponent = () => (
            <div>
                <button
                    data-hook={buttonOpenDataHook}
                    onClick={onClick}
                />
            </div>
        );

        driver = new TestPopupsDriver();
        driver.given.component(testedComponent).given.popupManager(popupManager);
        driver.when.create();

        driver.when.inGivenComponent.clickOn(buttonOpenDataHook);

        expect(driver.get.isPopupOpen()).toBe(true);
        driver.get.popupDriver(generateDataHook()).when.closePopup();
        expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
        expect(await responsePromise).toBe(expectedResponse);
    });

        it('should return arguments that modal\'s onClose sent, and that hasn\'t received "onClose" override', async () => {
            const buttonOpenDataHook = 'button-open';
            const popupManager = new PopupManager();
            let responsePromise: Promise<any>;
            const expectedResponse = ['modalResponse', false, -22];
            const onClick = () => {
                const {response} = popupManager.open(TestPopupUsesIsOpen, {overrideCloseArgs: expectedResponse});
                responsePromise = response;
            }

            const testedComponent = () => (
                <div>
                    <button
                        data-hook={buttonOpenDataHook}
                        onClick={onClick}
                    />
                </div>
            );

            driver = new TestPopupsDriver();
            driver.given.component(testedComponent).given.popupManager(popupManager);
            driver.when.create();

            driver.when.inGivenComponent.clickOn(buttonOpenDataHook);

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(generateDataHook()).when.closePopup();
            expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
            expect(await responsePromise).toEqual(expectedResponse);
        });

    it('should return NOTHING when when modal\'s onClose called with not arguments', async () => {
        const buttonOpenDataHook = 'button-open';
        const popupManager = new PopupManager();
        let responsePromise: Promise<any>;
        const onClick = () => {
            const {response} = popupManager.open(TestPopupUsesIsOpen, {overrideCloseArgs: null});
            responsePromise = response;
        }

        const testedComponent = () => (
            <div>
                <button
                    data-hook={buttonOpenDataHook}
                    onClick={onClick}
                />
            </div>
        );

        driver = new TestPopupsDriver();
        driver.given.component(testedComponent).given.popupManager(popupManager);
        driver.when.create();

        driver.when.inGivenComponent.clickOn(buttonOpenDataHook);

        expect(driver.get.isPopupOpen()).toBe(true);
        driver.get.popupDriver(generateDataHook()).when.closePopup();
        expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
        expect(await responsePromise).toBe(undefined);
    });


    it('should return exception when "onClose" has inner promise that is thrown', async () => {
        const popupManager = new PopupManager();
        let responsePromise: Promise<any>;
        const expectedError = 'Error in onClose';
        const onClick = () => {
            const {response} = popupManager.open(TestPopupUsesIsOpen, {
                onClose: async () => {
                    await new Promise(() => {
                        throw new Error(expectedError)
                    })

                }
            });
            responsePromise = response;
        }

        const testedComponent = () => (
            <div>
                <button
                    data-hook={buttonOpenDataHook}
                    onClick={onClick}
                />
            </div>
        );

        driver = new TestPopupsDriver();
        driver.given.component(testedComponent).given.popupManager(popupManager);
        driver.when.create();

        driver.when.inGivenComponent.clickOn(buttonOpenDataHook);

        expect(driver.get.isPopupOpen()).toBe(true);
        driver.get.popupDriver(generateDataHook()).when.closePopup();
        expect(driver.get.popupDriver(generateDataHook()).get.isOpen()).toBe(false);
        await expect(responsePromise).rejects.toThrow(expectedError);
    });
    }
);