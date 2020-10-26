import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuidv4 } from "uuid";
// can do double => because of thunk
// to get random id => npm i uuid
export const setAlert = (msg, alertType, timeout = 10000) => (dispatch) => {
  //generate a random
  const id = uuidv4();
  // create alert for reducers/alert
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
  // timeout to faded away
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
