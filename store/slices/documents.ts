import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDocument as Document } from '@/model/Document';

interface DocumentsState {
  items: Document[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

const initialState: DocumentsState = {
  items: [],
  isLoading: false,
  error: null,
  isSaving: false,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    fetchDocumentsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDocumentsSuccess: (state, action: PayloadAction<Document[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchDocumentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createDocumentRequest: (state, _action: PayloadAction<FormData>) => {
      state.isSaving = true;
      state.error = null;
    },
    createDocumentSuccess: (state, action: PayloadAction<Document>) => {
      state.isSaving = false;
      state.items.unshift(action.payload);
    },
    createDocumentFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    deleteDocumentRequest: (state, _action: PayloadAction<number>) => {
      state.isSaving = true;
      state.error = null;
    },
    deleteDocumentSuccess: (state, action: PayloadAction<number>) => {
      state.isSaving = false;
      state.items = state.items.filter(doc => doc.id !== action.payload);
    },
    deleteDocumentFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDocumentsRequest, fetchDocumentsSuccess, fetchDocumentsFailure,
  createDocumentRequest, createDocumentSuccess, createDocumentFailure,
  deleteDocumentRequest, deleteDocumentSuccess, deleteDocumentFailure,
} = documentsSlice.actions;

export default documentsSlice.reducer;
