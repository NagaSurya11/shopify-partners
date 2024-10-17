import { EntityId } from "@reduxjs/toolkit";
import { NotificationEntity } from "../../../slices/notification.slice";

export interface NotificationProps {
    notifications: Array<NotificationEntity>;
    removeNotification:  (id: EntityId) => void;
}