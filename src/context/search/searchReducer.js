import { HOGE } from "../types";

export default (state, action) => {
  switch (action.type) {
    case HOGE:
      return action.payload;
    default:
      return state;
  }
};
