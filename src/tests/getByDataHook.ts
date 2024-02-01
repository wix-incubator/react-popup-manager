import {ReactWrapper} from "enzyme";

export const getByDataHook = (wrapper: ReactWrapper, dataHook: string) => {
  return wrapper.find(`[data-hook="${dataHook}"]`);
}