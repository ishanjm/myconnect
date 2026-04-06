import { ofType, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { 
  fetchDocumentsRequest, fetchDocumentsSuccess, fetchDocumentsFailure,
  createDocumentRequest, createDocumentSuccess, createDocumentFailure,
  deleteDocumentRequest, deleteDocumentSuccess, deleteDocumentFailure
} from '../slices/documents';
import { documentsService } from '@/services/documentsService';
import { PayloadAction } from '@reduxjs/toolkit';

export const fetchDocumentsEpic: Epic = (action$) =>
  action$.pipe(
    ofType(fetchDocumentsRequest.type),
    mergeMap(() =>
      from(documentsService.fetchDocuments()).pipe(
        map((documents) => fetchDocumentsSuccess(documents)),
        catchError((error) => of(fetchDocumentsFailure(error.response?.data?.error || 'Failed to fetch documents')))
      )
    )
  );

export const createDocumentEpic: Epic = (action$) =>
  action$.pipe(
    ofType(createDocumentRequest.type),
    mergeMap((action: PayloadAction<FormData>) =>
      from(documentsService.createDocument(action.payload)).pipe(
        map((document) => createDocumentSuccess(document)),
        catchError((error) => of(createDocumentFailure(error.response?.data?.error || 'Failed to create document')))
      )
    )
  );

export const deleteDocumentEpic: Epic = (action$) =>
  action$.pipe(
    ofType(deleteDocumentRequest.type),
    mergeMap((action: PayloadAction<number>) =>
      from(documentsService.deleteDocument(action.payload)).pipe(
        map(() => deleteDocumentSuccess(action.payload)),
        catchError((error) => of(deleteDocumentFailure(error.response?.data?.error || 'Failed to delete document')))
      )
    )
  );
