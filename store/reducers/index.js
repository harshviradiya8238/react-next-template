import { combineReducers } from "redux";
import counterReducer from "./counter";
import userReducer from "./userAuthReducer";

const reducer = combineReducers({ count: counterReducer, user: userReducer });

export default reducer;
