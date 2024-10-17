export interface CustomAlertProps {
    isOpened: boolean;
    onClose: (value?: boolean) => void;
    dialogTitle: string;
    contentText: string;
    cancelText: string;
    confirmText: string;
    data?: any;
    warn?: boolean;
}