import { combineEpics } from 'redux-observable';
import { authEpic } from './authEpic';
import { locationsEpic } from './locationsEpic';
import { fetchCategoriesEpic, createCategoryEpic } from './documentCategoriesEpics';

export const rootEpic = combineEpics(
  authEpic,
  locationsEpic,
  fetchCategoriesEpic,
  createCategoryEpic
);
