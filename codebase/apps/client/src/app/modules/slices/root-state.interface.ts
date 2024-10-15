import { NOTIFICATION_FEATURE_KEY, NotificationState } from "./notification.slice";

export interface RootState {
    [NOTIFICATION_FEATURE_KEY]: NotificationState
}