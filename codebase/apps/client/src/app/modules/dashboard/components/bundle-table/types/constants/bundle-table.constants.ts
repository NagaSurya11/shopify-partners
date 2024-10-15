import { FilterInputType, PageSize } from "apps/client/src/app/modules/table/types/enums";
import { BundleTableInput } from "../interfaces";
import { FilterOptions, TableColumn } from "apps/client/src/app/modules/table/types/interfaces";

export const DefaultBundleTableInput: BundleTableInput = {
    page: {
        number: 1,
        size: PageSize.TWENTY
    }
};

export const BundleTableColumns: Array<TableColumn> = [
    {
        i18nKey: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.NAME',
        id: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.NAME',
        isSearchable: true,
        isSortable: true,
        name: 'name'
    },
    {
        i18nKey: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.DISCOUNT_PERCENTAGE',
        id: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.DISCOUNT_PERCENTAGE',
        isSearchable: true,
        isSortable: true,
        name: 'discount_percentage'
    },
    {
        i18nKey: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.TOTAL_SOLD',
        id: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.TOTAL_SOLD',
        isSearchable: true,
        isSortable: true,
        name: 'total_sold'
    },
    {
        i18nKey: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.BUNDLE_PRICE',
        id: 'DASHBOARD.BUNDLE_TABLE.COLUMNS.BUNDLE_PRICE',
        isSearchable: true,
        isSortable: true,
        name: 'bundle_price',
        currencySymbol: '\u20B9'
    }
]

export const BundleTableFilterOptions: Array<FilterOptions> = [
    {
        i18nKey: 'DASHBOARD.BUNDLE_TABLE.FILTER.DISCOUNT_FILTER',
        key: 'discount_percentage',
        data: {
            from: 0,
            to: 100,
            min: 0,
            max: 100,
            hasLabel: true,
            step: 0.1
        },
        type: FilterInputType.Between
    },
    {
        i18nKey: 'DASHBOARD.BUNDLE_TABLE.FILTER.PRICE_FILTER',
        key: 'bundle_price',
        data: {
            from: 0,
            to: 1000000,
            min: 0,
            max: 1000000
        },
        type: FilterInputType.Between
    },
    {
        i18nKey: 'DASHBOARD.BUNDLE_TABLE.FILTER.TOTAL_SOLD_FILTER',
        key: 'total_sold',
        data: {
            from: 0,
            to: 1000000,
            min: 0,
            max: 1000000
        },
        type: FilterInputType.Between
    }
]