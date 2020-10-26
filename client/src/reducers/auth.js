import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "../actions/types";

// store token in localStorage
const initState = {
  token: localStorage.getItem("token"),
  isAuthentication: null,
  //check if loading is done and got the res
  loading: true, // false is when loading
  user: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthentication: true,
        loading: false,
        user: payload, // where to get username,email, avatar,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthentication: true,
        loading: false,
      };
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthentication: false,
        loading: false,
      };
    default:
      return state;
  }
}
