import { HOGE } from "../types";

export default (state, action) => {
  switch (action.type) {
    case HOGE:
      return {
        ...state,
      };
    default:
      return state;
  }
};
