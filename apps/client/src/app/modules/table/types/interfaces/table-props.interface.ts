import { TableBodyProps } from "./table-body-props.interface";
import { TableFilterProps } from "./table-filter-props.interface";
import { TableFooterPropsInterface } from "./table-footer-props.interface";
import { TableHeadersProps } from "./table-header-props.interface";

export interface TableProps<A, T, E> {
    headerData: TableHeadersProps<A>;
    rootData: TableBodyProps<T, E>
    footerData: TableFooterPropsInterface;
    filterData: TableFilterProps;
}