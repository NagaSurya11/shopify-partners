import { FilterInputType, PageSize } from "../../../table/types/enums";
import { FilterOptions, RowAction, TableColumn, TableHeadersProps } from "../../../table/types/interfaces";
import { ViewDetailsProps } from "../../../view-details/types/interfaces";
import { ProductTableHeaderActions, ProductTableRowActions } from "../enums";
import { ListProductsInput } from "../interfaces";
import SelectAllIcon from '@mui/icons-material/SelectAll';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { CustomAlertProps } from "../../../custom-alert/types/interfaces";

export const DefaultListProductTableInput: ListProductsInput = {
    page: {
        number: 1,
        size: PageSize.TWENTY
    }
}

export const ListProductTableColumns: Array<TableColumn> = [
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
    }
]

export const productTableRowActions: Array<RowAction<ProductTableRowActions>> = [
    {
        action: ProductTableRowActions.VIEW_PRODUCT_DETAILS,
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_ROW.ACTIONS.VIEW_DETAILS'
    },
    {
        action: ProductTableRowActions.SELECT_PRODUCT,
        i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_ROW.ACTIONS.SELECT_PRODUCT'
    }
];

export const categoryFilterOption: FilterOptions = {
    i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_FILTER.FILTER_OPTIONS.CATEGORY_FILTER',
    type: FilterInputType.MultiSelectionList,
    data: {
        name: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_BODY.COLUMN.MAIN_CATEGORY',
        selectedOptions: []
    },
    key: 'categories'
};

export const ratingsFilterOption: FilterOptions = {
    i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_FILTER.FILTER_OPTIONS.RATINGS_FILTER',
    type: FilterInputType.Between,
    data: {
        min: 0,
        max: 5,
        from: 0,
        to: 5,
        step: 0.1,
        hasLabel: true
    },
    key: 'ratings'
}

export const priceFilterOption: FilterOptions = {
    i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_FILTER.FILTER_OPTIONS.PRICE_FILTER',
    type: FilterInputType.Between,
    data: {
        min: 0,
        max: 1000000,
        from: 0,
        to: 1000000
    },
    key: 'actualPrice'
}

export const listProductsViewDetailsDialogData: ViewDetailsProps = {
    isOpened: false,
    dialogTitle: 'CREATE_BUNDLE.LIST_PRODUCTS.VIEW_DETAILS.DIALOG.TITLE',
    cancelText: 'CREATE_BUNDLE.LIST_PRODUCTS.VIEW_DETAILS.DIALOG.CANCEL_TEXT',
    confirmText: 'CREATE_BUNDLE.LIST_PRODUCTS.VIEW_DETAILS.DIALOG.CONFIRM_TEXT',
    onClose: function (value?: any): void {
        this.isOpened = false;
    },
    currencySymbol: '\u20B9'
}


export const ProductTableHeaderConfig: TableHeadersProps<ProductTableHeaderActions> = {
    title: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_HEADER.TITLE',
    editModeList: [
        {
            action: ProductTableHeaderActions.SELECT_ALL_FILTERED,
            i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_HEADER.ACTIONS.SELECT_ALL_FILTERED_PRODUCTS',
            iconPosition: 'start',
            icon: SelectAllIcon,
            disabled: true
        },
        {
            action: ProductTableHeaderActions.RESET_TABLE,
            i18nKey: 'CREATE_BUNDLE.LIST_PRODUCTS.TABLE_HEADER.ACTIONS.RESET_TABLE',
            icon: RestartAltOutlinedIcon,
            iconPosition: 'start'
        }
    ]
}

export const BundleLimitReactedDialogProps: CustomAlertProps = {
    cancelText: 'CREATE_BUNDLE.ALERTS.CANCEL_TEXT',
    confirmText: 'CREATE_BUNDLE.ALERTS.CONFIRM_TEXT',
    contentText: 'CREATE_BUNDLE.ALERTS.CONTENT_TEXT',
    dialogTitle: 'CREATE_BUNDLE.ALERTS.DIALOG_TITLE',
    isOpened: false,
    onClose(value) {
        
    },
}