import { combineEpics } from 'redux-observable';
import { authEpic } from './authEpic';
import { locationsEpic } from './locationsEpic';
import { fetchCategoriesEpic, createCategoryEpic } from './documentCategoriesEpics';
import { fetchDocumentsEpic, createDocumentEpic, deleteDocumentEpic } from './documentsEpics';
import { postsEpics } from './postsEpics';

export const rootEpic = combineEpics(
  authEpic,
  locationsEpic,
  fetchCategoriesEpic,
  createCategoryEpic,
  fetchDocumentsEpic,
  createDocumentEpic,
  deleteDocumentEpic,
  postsEpics
);
