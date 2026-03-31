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
import { rootEpic } from './epics/rootEpic';

const rootReducer = combineReducers({
  auth: authReducer,
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
          FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
        ],
      },
    }).concat(epicMiddleware),
});

export const persistor = persistStore(store);

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
