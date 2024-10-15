import { PageSize, TableFooterActions } from "../enums";

export interface TableFooterPropsInterface {
    pageNumber: number;
    pageSize: PageSize;
    totalRows: number;
    actionButtonState?: {
        title: string;
        isVisible?: boolean;
        warn?: boolean;
    }
    onTableFooterEvents: (event: TableFooterActions, payload?: any) => void;
}