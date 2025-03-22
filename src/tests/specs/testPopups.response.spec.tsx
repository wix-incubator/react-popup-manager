import * as React from 'react';
import { generateDataHook, TestPopupUsesIsOpen } from '../TestPopupUsesIsOpen/TestPopupUsesIsOpen';
import { PopupManager } from '../../popupManager';
import { TestPopupsDriver } from '../TestPopups.driver';

describe('testPopups - "response" ', () => {
    const buttonOpenDataHook = 'button-open';
    let driver: TestPopupsDriver;
    let popupManager: PopupManager;

    beforeEach(() => {
        driver = new TestPopupsDriver();
        popupManager = new PopupManager();
    });

    interface SetupOptions {
        popupProps: Parameters<typeof TestPopupUsesIsOpen>[0];
    }

    const setupPopupTest = ({ popupProps }: SetupOptions) => {
        let responsePromise;
        let closeFunction: Function | undefined;

        const onClick = () => {
            const { response, close } = popupManager.open(TestPopupUsesIsOpen, popupProps);
            responsePromise = response;
            closeFunction = close;
        };

        const testedComponent = () => (
            <div>
                <button data-hook={buttonOpenDataHook} onClick={onClick} />
            </div>
        );

        driver.given.component(testedComponent).given.popupManager(popupManager);
        driver.when.create();
        driver.when.inGivenComponent.clickOn(buttonOpenDataHook);

        return {
            responsePromise,
            popupDataHook: generateDataHook(),
            close: closeFunction!,
        };
    };

    describe('when consumer provides onClose callback', () => {
        it('should return response of SYNCHRONOUS onClose', async () => {
            const expectedResponse = 'expectedResponseForOnCloseOverride';
            const { responsePromise, popupDataHook } = setupPopupTest({
                popupProps: {
                    onClose: () => expectedResponse,
                },
            });

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(popupDataHook).when.closePopup();
            expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);
            expect(await responsePromise).toBe(expectedResponse);
        });

        it('should return response of ASYNCHRONOUS onClose', async () => {
            const expectedResponse = 'expectedResponseForOnCloseOverride';
            const { responsePromise, popupDataHook } = setupPopupTest({
                popupProps: {
                    onClose: () => new Promise(resolve => setTimeout(() => resolve(expectedResponse), 100)),
                },
            });

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(popupDataHook).when.closePopup();
            expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);
            expect(await responsePromise).toBe(expectedResponse);
        });

        it('should return exception when onClose promise is rejected', async () => {
            const expectedError = 'Error in onClose';
            const { responsePromise, popupDataHook } = setupPopupTest({
                popupProps: {
                    onClose: async () => {
                        await new Promise(() => {
                            throw new Error(expectedError);
                        });
                    },
                },
            });

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(popupDataHook).when.closePopup();
            expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);
            await expect(responsePromise).rejects.toThrow(expectedError);
        });
    });

    describe('when consumer does not provide onClose callback', () => {
        it('should return single argument passed to onClose', async () => {
            const { responsePromise, popupDataHook } = setupPopupTest({
                popupProps: {
                    overrideCloseArgs: [{ data: 'param1' }],
                },
            });

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(popupDataHook).when.closePopup();
            expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);

            const response = await responsePromise;
            expect(response).toEqual({ data: 'param1' });
        });

        it('should return multiple arguments passed to onClose as array', async () => {
            const { responsePromise, popupDataHook } = setupPopupTest({
                popupProps: {
                    overrideCloseArgs: [{ data: 'param1' }, { meta: 'param2' }],
                },
            });

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(popupDataHook).when.closePopup();
            expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);

            const response = await responsePromise;
            expect(response).toEqual([{ data: 'param1' }, { meta: 'param2' }]);
        });

        it('should return undefined when onClose called with no arguments', async () => {
            const { responsePromise, popupDataHook } = setupPopupTest({
                popupProps: { overrideCloseArgs: null },
            });

            expect(driver.get.isPopupOpen()).toBe(true);
            driver.get.popupDriver(popupDataHook).when.closePopup();
            expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);
            expect(await responsePromise).toBe(undefined);
        });

        describe('When using close function', () => {
            it('should return data when closed from outside using close function', async () => {
                const expectedResponse = { data: { value: 'expectedResponseForCloseFunction' } };
                const { responsePromise, close, popupDataHook } = setupPopupTest({
                    popupProps: {},
                });

                expect(driver.get.isPopupOpen()).toBe(true);
                close!(expectedResponse);

                const response = await responsePromise;
                expect(response).toEqual(expectedResponse);

                driver.update();
                expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);
            });

            it('should return array of args when closed with multiple arguments', async () => {
                const expectedArgs = ['param1', 'param2'];
                const { responsePromise, close, popupDataHook } = setupPopupTest({
                    popupProps: {},
                });

                expect(driver.get.isPopupOpen()).toBe(true);
                close!(...expectedArgs);

                const response = await responsePromise;
                expect(response).toEqual(expectedArgs);

                driver.update();
                expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);
            });

            it('should return undefined when closed without arguments', async () => {
                const { responsePromise, close, popupDataHook } = setupPopupTest({
                    popupProps: {},
                });

                expect(driver.get.isPopupOpen()).toBe(true);
                close!();
                const response = await responsePromise;
                expect(response).toBeUndefined();

                driver.update();
                expect(driver.get.popupDriver(popupDataHook).get.isOpen()).toBe(false);
            });
        });
    });
});
