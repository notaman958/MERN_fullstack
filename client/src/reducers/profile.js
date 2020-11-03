import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_ALL_PROFILES,
  GET_GITHUB,
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [], // list of other dev profiles
  repos: [], // for github
  loading: true,
  error: {}, // if have errors
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_PROFILE:
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_ALL_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: true,
      };
    case GET_GITHUB:
      return {
        ...state,
        repos: payload,
        loading: false,
      };
    default:
      return state;
  }
}
