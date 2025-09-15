import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import jobSlice from "./jobSlice.js";
import companySlice from "./companySlice.js";
import applicationSlice from "./applicationSlice.js";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice, // for the user
  job: jobSlice, // for jobs
  company: companySlice, // for the company
  application: applicationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  // reducer: { auth: authSlice, job: jobSlice },
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;

//since we wanted to fetch all the jobs at the home page, so that user will get to see all jobs. we did it using custom hooks.

// we took the persistance related code from the official redux documentation 'https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist'
