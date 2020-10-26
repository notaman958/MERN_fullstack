import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
const initState = [];
//from actions/types.js
export default function (state = initState, action) {
  // action has payload props + type
  const { type, payload } = action;
  // state is the array from initState
  switch (type) {
    case SET_ALERT:
      return [...state, payload]; //keep the current and add the state
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); // return all alert except for matching payload
    default:
      return state;
  }
}
