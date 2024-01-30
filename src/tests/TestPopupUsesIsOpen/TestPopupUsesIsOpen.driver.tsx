import {ReactWrapper} from "enzyme";
import {getByDataHook} from "../getByDataHook";

export class TestPopupUsesIsOpenDriver {
    constructor(private component: ReactWrapper<any>) {
    }

    private getByDataHook(
        hook: string,
        parent: ReactWrapper<any, any> = this.component,
    ): ReactWrapper<any, any> {
        return getByDataHook(parent,hook);
    }

    public when = {
        closePopup: (): TestPopupUsesIsOpenDriver => {
            this.get.closeButton().simulate('click');
            return this;
        },
    };

    public get = {
        exists: () => this.component.exists(),
        isOpen: () => this.component.props()['data-is-open'],
        closeButton: () => this.getByDataHook('close-button'),
        content: () => this.getByDataHook('popup-content').text(),
    }
}
