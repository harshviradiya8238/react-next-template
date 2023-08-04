import { combineReducers } from "redux";
import counterReducer from "./counter";
import userReducer from "./userAuthReducer";
import loanReducer from "./loanReducer";

const reducer = combineReducers({
  count: counterReducer,
  user: userReducer,
  loan: loanReducer,
});

export default reducer;
