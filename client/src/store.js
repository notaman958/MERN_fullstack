/* redux store */
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
// createstore doc https://redux.js.org/api/createstore
const initState = {};
const middleware = [thunk];
const store = createStore(
  rootReducer,
  initState,
  composeWithDevTools(applyMiddleware(...middleware)) // showing fancy in browser
);
export default store;
