import {
  DELETE_POST,
  GET_POSTS,
  LIKED_ERROR,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_LIKES:
      return {
        ...state,
        // here dont return array of likes what we want is the current post but with updated like
        posts: state.posts.map((post) =>
          post._id === payload.id
            ? {
                ...post,
                likes: payload.likes,
              }
            : post
        ),
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        // add new post(payload) into posts
        posts: [...state.posts, payload],
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        // return the new post array without the deleted one
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };
    case POST_ERROR:
    case LIKED_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter((cmt) => cmt._id !== payload),
        },
        loading: false,
      };
    default:
      return state;
  }
}
