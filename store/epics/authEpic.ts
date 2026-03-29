import { Epic, ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerSuccess, registerFailure } from '../slices/auth';
import { loginApi, registerApi } from '@/services/authService';

const loginEpic: Epic = (action$) =>
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

const registerEpic: Epic = (action$) =>
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

export const authEpic = combineEpics(loginEpic, registerEpic);
