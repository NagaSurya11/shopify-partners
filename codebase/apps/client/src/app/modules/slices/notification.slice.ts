import { AlertColor } from '@mui/material';
import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from './root-state.interface';
import {v4} from 'uuid';

export const NOTIFICATION_FEATURE_KEY = 'notification';

/*
 * Update these interfaces according to your requirements.
 */
export interface NotificationEntity {
  id: string;
  open: boolean;
  severity: AlertColor;
  message: string;
}

export interface NotificationState extends EntityState<NotificationEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
}

export const notificationAdapter = createEntityAdapter<NotificationEntity>();

export const initialNotificationState: NotificationState =
  notificationAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
  });

export const notificationSlice = createSlice({
  name: NOTIFICATION_FEATURE_KEY,
  initialState: initialNotificationState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{severity: AlertColor, message: string}>
    ) => {
      const id = v4();
      notificationAdapter.addOne(state, {...action.payload, id, open: true});
      state.ids.push(id);
    },
    removeNotification: (state, action: PayloadAction<EntityId>) => {
      notificationAdapter.removeOne(state, action.payload);
      state.ids = state.ids.filter(id => id !== action.payload);
    }
  }
});

export const notificationReducer = notificationSlice.reducer;

export const notificationActions = notificationSlice.actions;

const { selectAll, selectEntities } = notificationAdapter.getSelectors();

export const getNotificationState = (rootState: RootState): NotificationState => rootState[NOTIFICATION_FEATURE_KEY];

export const selectAllNotification = createSelector(
  getNotificationState,
  selectAll
);

export const selectNotificationEntities = createSelector(
  getNotificationState,
  selectEntities
);
