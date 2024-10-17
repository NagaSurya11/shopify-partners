import { CustomAlertProps } from "../../../custom-alert/types/interfaces";
import { TableFilterProps } from "../../../table/types/interfaces";
import { ViewDetailsProps } from "../../../view-details/types/interfaces";
import { BundleSearchOption } from "./bundle-search-option.interface";
import { ListProductsInput } from "./list-products-input.interface";
import { ListProductsOutput } from "./list-products-output.interface";
import { Product } from "./product.interface";

export interface ManageBundleStateInterface {
    // list products state
    isProductsTableLoading: boolean;
    listProductsInput: ListProductsInput;
    listProductsOutput: ListProductsOutput;
    selectedProducts: Set<string>;
    productFilterData: TableFilterProps;
    listProductRows: Product[];
    listProductsViewDetailsDialogData: ViewDetailsProps;
    currentProductId?: string;

    // bundle info state
    bundleProductsSet: Set<string>;
    bundleLimitWarningDialogProps: CustomAlertProps;
    bundleProductsInput: ListProductsInput;
    bundleProductsOutput: ListProductsOutput;
    isBundleTableLoading: boolean;
    bundleProductRows: Product[];
    bundleTableSelectedRows: Set<string>;
    bundleProductFilterData: TableFilterProps;
    bundleTableQuantityMap: Map<string, number>;
    bundleDiscountPercentage: number;
    bundleActualPrice: number;
    bundleTotalPrice: number;
    bundleName: string;
    bundleId?: string;

    // autocomplete state
    isBundleSearchOpened: boolean;
    isBundleSearchLoading: boolean;
    bundleSearchOptions: BundleSearchOption[];
    bundleSearchTerm: string;
}