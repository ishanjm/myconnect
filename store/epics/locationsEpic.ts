import { Epic, ofType, combineEpics } from 'redux-observable';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { Action } from '@reduxjs/toolkit';
import {
  fetchLocationsRequest, fetchLocationsSuccess, fetchLocationsFailure,
  createLocationRequest, createLocationSuccess, createLocationFailure,
  updateLocationRequest, updateLocationSuccess, updateLocationFailure,
  deleteLocationRequest, deleteLocationSuccess, deleteLocationFailure
} from '../slices/locations';
import * as locApi from '@/services/locationsService';

const fetchLocationsEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(fetchLocationsRequest.type),
    switchMap(() =>
      locApi.getLocationsApi().pipe(
        map((response: any) => fetchLocationsSuccess(response.locations)),
        catchError((error) => of(fetchLocationsFailure(error.response?.data?.error || 'Failed to fetch locations')))
      )
    )
  );

const createLocationEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(createLocationRequest.type),
    mergeMap((action: any) =>
      locApi.createLocationApi(action.payload).pipe(
        map((response: any) => createLocationSuccess(response.location)),
        catchError((error) => of(createLocationFailure(error.response?.data?.error || 'Failed to create location')))
      )
    )
  );

const updateLocationEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(updateLocationRequest.type),
    mergeMap((action: any) =>
      locApi.updateLocationApi(action.payload).pipe(
        map((response: any) => updateLocationSuccess(response.location)),
        catchError((error) => of(updateLocationFailure(error.response?.data?.error || 'Failed to update location')))
      )
    )
  );

const deleteLocationEpic: Epic<Action> = (action$) =>
  action$.pipe(
    ofType(deleteLocationRequest.type),
    mergeMap((action: any) =>
      locApi.deleteLocationApi(action.payload).pipe(
        map(() => deleteLocationSuccess(action.payload)),
        catchError((error) => of(deleteLocationFailure(error.response?.data?.error || 'Failed to delete location')))
      )
    )
  );

export const locationsEpic = combineEpics(
  fetchLocationsEpic,
  createLocationEpic,
  updateLocationEpic,
  deleteLocationEpic
);
