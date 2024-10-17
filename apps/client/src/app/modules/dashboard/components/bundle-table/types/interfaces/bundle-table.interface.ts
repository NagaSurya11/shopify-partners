import { AlertColor } from "@mui/material";
import { WithApolloClientProps } from "apps/client/src/app/modules/graphql-client/types/interfaces";
import { WithRouterPropsInterface } from "apps/client/src/app/modules/routing/types/interfaces";
import { PageSize } from "apps/client/src/app/modules/table/types/enums"
import { BetweenOutputData, FilterOptions, Sort } from "apps/client/src/app/modules/table/types/interfaces";

export interface Bundle {
    bundle_id: string;
    name: string;
    discount_percentage: number;
    total_sold: number;
    bundle_price: number;
    images?: string[];
}

export interface BundleTableInput {
    page: {
        size: PageSize,
        number: number;
    },
    sort?: Sort,
    filter?: {
        discount_percentage?: BetweenOutputData;
        total_sold?: BetweenOutputData;
        bundle_price?: BetweenOutputData;
    }
}

export interface BundleTableOutput {
    rows: Bundle[],
    totalRows: number;
}

export interface BundleTableState {
    tableInput: BundleTableInput;
    tableOutput: BundleTableOutput;
    tableRows: Bundle[];
    isTableLoading: boolean;
    selectedRows: Set<string>;
    isFilterLoading: boolean;
    isBundleFilterOpened: boolean;
    filterOptions: FilterOptions[];
    isDeleteDialogOpened: boolean;
    deleteDialogData: Set<string> | null;
    isViewDetailsOpened: boolean;
    bundleDetails?: Bundle;
    isViewDetailsLoading: boolean;
}

interface BundleTablePropsInterface {
    showNotification: (entity: {severity: AlertColor, message: string}) => void;
    fetchCharts: () => void;
}


export type BundleTableProps = BundleTablePropsInterface & WithApolloClientProps & WithRouterPropsInterface;