import { Epic, ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { loginRequest, loginSuccess, loginFailure } from '../slices/auth';
import { loginApi } from '@/services/authService';

export const authEpic: Epic = (action$) =>
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
