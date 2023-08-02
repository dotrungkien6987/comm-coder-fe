import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { Dialpad } from "@mui/icons-material";
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";
import useAuth from "../../hooks/useAuth";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload;
      if (state.currentPagePosts.length % POST_PER_PAGE === 0)
        state.currentPagePosts.pop();

      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { count, posts } = action.payload;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      state.totalPosts = count;
    },
    editPostSuccess(state, action) {
      
      state.isLoading = false;
      state.error = null;
      console.log("payloadEdit", action.payload);
      
      state.postsById[action.payload._id] = action.payload;
      // state.postsById[action.payload._id].author =user;
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      const { _id } = action.payload;
      console.log("payloadDelete", action.payload);
      console.log("postDelete", _id);

      const idDeleteInCurrentPagePosts = state.currentPagePosts.findIndex(
        (id) => id === _id
      );
      console.log("inDel2", idDeleteInCurrentPagePosts);
      state.currentPagePosts.splice(idDeleteInCurrentPagePosts, 1);

      delete state.postsById[_id];
    },
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },
    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
  },
});

export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      //upload image to cloudinary
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.createPostSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export const getPosts =
  ({ userID, page, limit = POST_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // console.log(`${userID} in getPosts`);
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userID}`, {
        params,
      });
      if (page === 1) dispatch(slice.actions.resetPosts());
      dispatch(slice.actions.getPostSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
export const deletePost = (postId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/posts/${postId}`);

    dispatch(slice.actions.deletePostSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};
export const editPost = (post, content, image) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const imageUrl = await cloudinaryUpload(image);
    const body = { content: content, image: imageUrl };
    const author = post.author;
    const response = await apiService.put(`/posts/${post._id}`, body);

    dispatch(slice.actions.editPostSuccess({...response.data.data, author}));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
  }
};
export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    console.log(`postID in sendPostReation is`, postId, emoji);
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };

export default slice.reducer;
