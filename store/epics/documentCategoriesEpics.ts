import { ofType, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError, filter } from 'rxjs/operators';
import { Action } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { 
  fetchCategoriesRequest, fetchCategoriesSuccess, fetchCategoriesFailure,
  createCategoryRequest, createCategorySuccess, createCategoryFailure
} from '../slices/documentCategories';
import { documentCategoriesService } from '@/services/documentCategoriesService';

export const fetchCategoriesEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(fetchCategoriesRequest.type),
    mergeMap(() =>
      from(documentCategoriesService.fetchCategories()).pipe(
        map((categories) => fetchCategoriesSuccess(categories)),
        catchError((error) => of(fetchCategoriesFailure(error.response?.data?.error || 'Failed to fetch categories')))
      )
    )
  );

export const createCategoryEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(createCategoryRequest.type),
    mergeMap((action: any) =>
      from(documentCategoriesService.createCategory(action.payload)).pipe(
        map((category) => createCategorySuccess(category)),
        catchError((error) => of(createCategoryFailure(error.response?.data?.error || 'Failed to create category')))
      )
    )
  );
