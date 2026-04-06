import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth';
import locationsReducer from './slices/locations';
import documentCategoriesReducer from './slices/documentCategories';
import documentsReducer from './slices/documents';
import postsReducer from './slices/posts';
import { rootEpic } from './epics/rootEpic';

const rootReducer = combineReducers({
  auth: authReducer,
  locations: locationsReducer,
  documentCategories: documentCategoriesReducer,
  documents: documentsReducer,
  posts: postsReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      thunk: false,
      serializableCheck: {
        ignoredActions: [
          'auth/registerRequest',
          'documents/createDocumentRequest',
          'posts/createPostRequest',
          FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
        ],
      },
    }).concat(epicMiddleware),
});

export const persistor = persistStore(store);

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
