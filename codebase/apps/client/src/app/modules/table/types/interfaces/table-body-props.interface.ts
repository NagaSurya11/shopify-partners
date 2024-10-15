import { TableBodyActions } from "../enums";
import { Sort } from "./sort-interface";

export interface TableColumn {
    id: string;
    i18nKey: string;
    name: string;
    isSearchable: boolean;
    // to add start based column with rating value
    isRatingsColumn?: boolean;
    // to add ruppess before value
    currencySymbol?: string;
    // is quantity column
    isQuantityColumn?: boolean;
    isSortable: boolean;
}

export interface RowAction<E> {
    action: E;
    i18nKey: string;
    warn?: boolean;
}
export interface TableBodyProps<T, E> {
    isLoading?: boolean;
    hasSelect?: boolean;
    selectedRows?: Set<string>;
    columns: Array<TableColumn>;
    sort?: Sort;
    actions?: Array<RowAction<E>>;
    idColumnName: string;
    rows: Array<T>;
    onTableBodyEvents: (event: TableBodyActions | E | any, payload?: any) => void;
    quantityMap?: Map<string, number>;
}