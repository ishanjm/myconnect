import { combineEpics } from 'redux-observable';
import { authEpic } from './authEpic';

export const rootEpic = combineEpics(
  authEpic
);
