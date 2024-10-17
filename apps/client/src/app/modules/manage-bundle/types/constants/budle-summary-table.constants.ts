import { TableColumn, TableHeadersProps } from "../../../table/types/interfaces";
import { BundleTableHeaderAction } from "../enums";
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';


export const BundleSummaryTableHeaderConfig: TableHeadersProps<BundleTableHeaderAction> = {
    title: 'BUNDLE_SUMMARY.TABLE.HEADER.TITLE',
    editModeList: [
        {
            action: BundleTableHeaderAction.RESET_TABLE,
            i18nKey: 'BUNDLE_SUMMARY.TABLE.HEADER.RESET_TABLE',
            icon: RestartAltOutlinedIcon,
            iconPosition: 'start'
        }
    ]
}

export const BundleSummaryTableColumns: Array<TableColumn> = [
    {
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.NAME',
        id: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.NAME',
        name: 'name',
        isSearchable: true,
        isSortable: true
    },
    {
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.MAIN_CATEGORY',
        id: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.MAIN_CATEGORY',
        name: 'main_category',
        isSearchable: true,
        isSortable: true
    },
    {
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.SUB_CATEGORY',
        id: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.SUB_CATEGORY',
        name: 'sub_category',
        isSearchable: true,
        isSortable: true
    },
    {
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.RATINGS',
        id: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.RATINGS',
        name: 'ratings',
        isRatingsColumn: true,
        isSearchable: false,
        isSortable: true
    },
    {
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.NO_OF_RATINGS',
        id: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.NO_OF_RATINGS',
        name: 'no_of_ratings',
        isSearchable: true,
        isSortable: true
    },
    {
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.ACTUAL_PRICE',
        id: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.ACTUAL_PRICE',
        name: 'actual_price',
        currencySymbol: '\u20B9',
        isSearchable: true,
        isSortable: true
    },
    {
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.QUANTITY',
        id: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.QUANTITY',
        name: 'quantity',
        isQuantityColumn: true,
        isSearchable: false,
        isSortable: false
    }
]