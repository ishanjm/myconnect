import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILocation as Location, CreateLocationPayload, UpdateLocationPayload } from '@/model/Location';

interface LocationsState {
  items: Location[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

const initialState: LocationsState = {
  items: [],
  isLoading: false,
  error: null,
  isSaving: false,
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    fetchLocationsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchLocationsSuccess: (state, action: PayloadAction<Location[]>) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchLocationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createLocationRequest: (state, action: PayloadAction<CreateLocationPayload>) => {
      state.isSaving = true;
      state.error = null;
    },
    createLocationSuccess: (state, action: PayloadAction<Location>) => {
      state.isSaving = false;
      state.items.push(action.payload);
      state.items.sort((a, b) => a.name.localeCompare(b.name));
    },
    createLocationFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    updateLocationRequest: (state, action: PayloadAction<UpdateLocationPayload>) => {
      state.isSaving = true;
      state.error = null;
    },
    updateLocationSuccess: (state, action: PayloadAction<Location>) => {
      state.isSaving = false;
      state.items = state.items.map(item => item.id === action.payload.id ? action.payload : item);
      state.items.sort((a, b) => a.name.localeCompare(b.name));
    },
    updateLocationFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    deleteLocationRequest: (state, action: PayloadAction<number>) => {
      state.isSaving = true;
      state.error = null;
    },
    deleteLocationSuccess: (state, action: PayloadAction<number>) => {
      state.isSaving = false;
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    deleteLocationFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchLocationsRequest, fetchLocationsSuccess, fetchLocationsFailure,
  createLocationRequest, createLocationSuccess, createLocationFailure,
  updateLocationRequest, updateLocationSuccess, updateLocationFailure,
  deleteLocationRequest, deleteLocationSuccess, deleteLocationFailure,
  clearError
} = locationsSlice.actions;

export default locationsSlice.reducer;
