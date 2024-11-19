import { configureStore, combineReducers } from '@reduxjs/toolkit';
import exampleReducer from '../store/slices/exampleSlice';
import userReducer from '../store/slices/userSlice';
import themeReducer from '../features/theme/themeSlice';
import authReducer from '../store/slices/authSlice';
import csrfReducer from '../store/slices/csrfSlice';
import sessionReducer from '../store/slices/sessionSlice';
import { api } from '../api/apiSlice';
import { employeePayPeriodApi } from '../api/employeePayPeriodApiSlice';
import { timeEntryApi } from '../api/timeEntryApiSlice';
import { payPeriodApi } from '../api/payPeriodApiSlice'; 
import { roleApi } from '../api/roleApi';
import { settingApi } from '../api/settingApi';
import { surveyApi } from '../api/surveyApi';
import { permissionApi } from '../api/permissionApi';
import { resourceApi } from '../api/resourceApiSlice';
import { incidentApi } from '../api/incidentApiSlice';
import { supportApi } from '../api/supportApiSlice';
import { shiftApi } from '../api/shiftApi';
import { usersApi } from '../api/usersApi';
import { ticketsApi } from '../api/ticketsApi';
import { approvalsApi } from '../api/approvalsApi';
import { appraisalQuestionApi } from '../api/appraisalQuestionApi';
import { appraisalMetricApi } from '../api/appraisalMetricApi';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Configuration for Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist the auth slice
};

// Combine all reducers
const rootReducer = combineReducers({
  example: exampleReducer,
  user: userReducer,
  theme: themeReducer,
  auth: authReducer,
  csrf: csrfReducer,
  session: sessionReducer,
  [api.reducerPath]: api.reducer,
  [employeePayPeriodApi.reducerPath]: employeePayPeriodApi.reducer,
  [timeEntryApi.reducerPath]: timeEntryApi.reducer,
  [payPeriodApi.reducerPath]: payPeriodApi.reducer,
  [surveyApi.reducerPath]: surveyApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [settingApi.reducerPath]: settingApi.reducer,
  [permissionApi.reducerPath]: permissionApi.reducer,
  [resourceApi.reducerPath]: resourceApi.reducer,
  [incidentApi.reducerPath]: incidentApi.reducer,
  [supportApi.reducerPath]: supportApi.reducer,
  [shiftApi.reducerPath]: shiftApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [ticketsApi.reducerPath]: ticketsApi.reducer,
  [approvalsApi.reducerPath]: approvalsApi.reducer,
  [appraisalQuestionApi.reducerPath]: appraisalQuestionApi.reducer,
  [appraisalMetricApi.reducerPath]: appraisalMetricApi.reducer,

});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }).concat(
      api.middleware,
      employeePayPeriodApi.middleware,
      timeEntryApi.middleware,
      payPeriodApi.middleware,
      surveyApi.middleware,
      roleApi.middleware,
      settingApi.middleware,
      permissionApi.middleware,
      resourceApi.middleware,
      incidentApi.middleware,
      supportApi.middleware,
      shiftApi.middleware,
      usersApi.middleware,
      ticketsApi.middleware,
      approvalsApi.middleware,
      appraisalQuestionApi.middleware,
      appraisalMetricApi.middleware,
    ),
});

// Create the persistor
export const persistor = persistStore(store);

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;