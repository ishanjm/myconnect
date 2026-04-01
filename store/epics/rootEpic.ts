import { combineEpics } from 'redux-observable';
import { authEpic } from './authEpic';
import { locationsEpic } from './locationsEpic';

export const rootEpic = combineEpics(
  authEpic,
  locationsEpic
);
