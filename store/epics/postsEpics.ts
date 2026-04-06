import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, filter } from 'rxjs/operators';
import { Action } from '@reduxjs/toolkit';
import { 
  fetchPostsRequest, 
  fetchPostsSuccess, 
  fetchPostsFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure
} from '../slices/posts';
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

export const postsEpics = combineEpics(
  fetchPostsEpic,
  createPostEpic
);
