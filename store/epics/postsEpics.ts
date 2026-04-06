import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, filter } from 'rxjs/operators';
import { Action } from '@reduxjs/toolkit';
import { 
  fetchPostsRequest, 
  fetchPostsSuccess, 
  fetchPostsFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure,
  deletePostRequest,
  deletePostSuccess,
  deletePostFailure
} from '../slices/posts';
import axios from 'axios';
import { postsService } from '@/services/postsService';

const fetchPostsEpic: Epic<Action> = (action$) =>
  action$.pipe(
    filter(fetchPostsRequest.match),
    switchMap(() => 
      from(postsService.getPosts()).pipe(
        map((posts) => fetchPostsSuccess(posts)),
        catchError((error) => of(fetchPostsFailure(error.message)))
      )
    )
  );

const createPostEpic: Epic<Action> = (action$) =>
  action$.pipe(
    filter(createPostRequest.match),
    switchMap((action) =>
      from(postsService.createPost(action.payload.content, action.payload.file)).pipe(
        map((post) => createPostSuccess(post)),
        catchError((error) => of(createPostFailure(error.message)))
      )
    )
  );

const deletePostEpic: Epic<Action> = (action$) =>
  action$.pipe(
    filter(deletePostRequest.match),
    switchMap((action) =>
      from(axios.delete(`/api/posts/${action.payload}`)).pipe(
        map(() => deletePostSuccess(action.payload)),
        catchError((error) => of(deletePostFailure(error.response?.data?.error || 'Failed to delete shoutout')))
      )
    )
  );

export const postsEpics = combineEpics(
  fetchPostsEpic,
  createPostEpic,
  deletePostEpic
);
