export interface ViewDetailsProps {
    isOpened: boolean;
    onClose: (value?: any) => void;
    dialogTitle: string;
    breadCrumbs?: string[];
    images?: string[];
    name?: string;
    price?: number;
    ratings?: number;
    noOfRatings?: number;
    cancelText: string;
    confirmText: string;
    isLoading?: boolean;
    currencySymbol?: string;
    totalSold?: number;
    discountPercentage?: number;
    data?: any;
}