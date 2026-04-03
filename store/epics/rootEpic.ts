import { combineEpics } from 'redux-observable';
import { authEpic } from './authEpic';
import { locationsEpic } from './locationsEpic';
import { fetchCategoriesEpic, createCategoryEpic } from './documentCategoriesEpics';
import { fetchDocumentsEpic, createDocumentEpic } from './documentsEpics';

export const rootEpic = combineEpics(
  authEpic,
  locationsEpic,
  fetchCategoriesEpic,
  createCategoryEpic,
  fetchDocumentsEpic,
  createDocumentEpic
);
