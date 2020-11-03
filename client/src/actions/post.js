import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  LIKED_ERROR,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "./types";

// get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// add likes
export const addLikes = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
    console.log("LIKE");
  } catch (err) {
    dispatch({
      type: LIKED_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// delete likes
export const unLikes = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
    console.log("UNLIKE");
  } catch (err) {
    dispatch({
      type: LIKED_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
    dispatch(setAlert("Post removed", "success"));
    console.log("POST delete");
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts`, formData);
    console.log(res);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert("Post Added", "success"));
    console.log("POST added");
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`);
    console.log(res);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
    console.log("get post");
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add COMMENT
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/comments/${postId}`, formData);
    console.log(res);
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert("Comment Added", "success"));
    console.log("COMMENT added");
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete COMMENT
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/posts/comments/${postId}/${commentId}`
    );
    console.log(res);
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });
    dispatch(setAlert("Comment removed", "success"));
    console.log("COMMENT removed");
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
