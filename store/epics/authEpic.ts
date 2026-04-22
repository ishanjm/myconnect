import { Epic, ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { Action } from '@reduxjs/toolkit';
import { 
  loginRequest, loginSuccess, loginFailure, 
  registerRequest, registerSuccess, registerFailure,
  logoutRequest, logoutSuccess, logoutFailure,
  meRequest, meSuccess, meFailure,
  updateProfileImageRequest, updateProfileImageSuccess, updateProfileImageFailure 
} from '../slices/auth';
import { loginApi, registerApi, logoutApi, meApi, updateProfileImageApi } from '@/services/authService';

const loginEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(loginRequest.type),
    mergeMap((action: any) =>
      loginApi(action.payload).pipe(
        map((response) => loginSuccess({ user: response.user, token: response.token })),
        catchError((error) => {
          let errorMsg = 'An unknown error occurred';
          if (error.response?.data?.error) {
            errorMsg = error.response.data.error;
          } else if (error.message) {
            errorMsg = error.message;
          }
          return of(loginFailure(errorMsg));
        })
      )
    )
  );

const registerEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(registerRequest.type),
    mergeMap((action: any) =>
      registerApi(action.payload).pipe(
        map((response) => registerSuccess({ user: response.user, token: response.token })),
        catchError((error) => {
          let errorMsg = 'An unknown error occurred';
          if (error.response?.data?.error) {
            errorMsg = error.response.data.error;
          } else if (error.message) {
            errorMsg = error.message;
          }
          return of(registerFailure(errorMsg));
        })
      )
    )
  );

export const logoutEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(logoutRequest.type),
    switchMap(() =>
      from(logoutApi()).pipe(
        map(() => logoutSuccess()),
        catchError((error: any) =>
          of(logoutFailure(error.response?.data?.error || 'Logout failed'))
        )
      )
    )
  );

export const meEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(meRequest.type),
    switchMap(() =>
      from(meApi()).pipe(
        map((response: any) => meSuccess(response)),
        catchError(() =>
          of(meFailure())
        )
      )
    )
  );

export const updateProfileImageEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(updateProfileImageRequest.type),
    mergeMap((action: any) =>
      updateProfileImageApi(action.payload).pipe(
        map((response) => updateProfileImageSuccess({ profileImage: response.profileImage })),
        catchError((error) => {
          let errorMsg = 'Failed to update profile image';
          if (error.response?.data?.error) {
            errorMsg = error.response.data.error;
          } else if (error.message) {
            errorMsg = error.message;
          }
          return of(updateProfileImageFailure(errorMsg));
        })
      )
    )
  );

export const authEpic = combineEpics(loginEpic, registerEpic, logoutEpic, meEpic, updateProfileImageEpic);
