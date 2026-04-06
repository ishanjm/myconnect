import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostAttributes } from '@/model/Post';

interface PostsState {
  posts: PostAttributes[];
  isLoading: boolean;
  isPosting: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  isPosting: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<PostAttributes[]>) => {
      state.posts = action.payload;
      state.isLoading = false;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostRequest: (state, action: PayloadAction<{ content: string; file: File | null }>) => {
      state.isPosting = true;
      state.error = null;
    },
    createPostSuccess: (state, action: PayloadAction<PostAttributes>) => {
      state.posts = [action.payload, ...state.posts];
      state.isPosting = false;
    },
    createPostFailure: (state, action: PayloadAction<string>) => {
      state.isPosting = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure,
} = postsSlice.actions;

export default postsSlice.reducer;
