import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDocumentCategory, CreateDocumentCategoryPayload } from '@/model/DocumentCategory';

interface DocumentCategoriesState {
  items: IDocumentCategory[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

const initialState: DocumentCategoriesState = {
  items: [],
  isLoading: false,
  error: null,
  isSaving: false,
};

const documentCategoriesSlice = createSlice({
  name: 'documentCategories',
  initialState,
  reducers: {
    fetchCategoriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<IDocumentCategory[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCategoryRequest: (state, action: PayloadAction<CreateDocumentCategoryPayload>) => {
      state.isSaving = true;
      state.error = null;
    },
    createCategorySuccess: (state, action: PayloadAction<IDocumentCategory>) => {
      state.isSaving = false;
      state.items.push(action.payload);
      state.items.sort((a, b) => a.name.localeCompare(b.name));
    },
    createCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchCategoriesRequest, fetchCategoriesSuccess, fetchCategoriesFailure,
  createCategoryRequest, createCategorySuccess, createCategoryFailure,
  clearCategoryError
} = documentCategoriesSlice.actions;

export default documentCategoriesSlice.reducer;
