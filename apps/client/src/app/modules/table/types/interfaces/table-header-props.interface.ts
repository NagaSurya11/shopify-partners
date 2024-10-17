import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { TableHeaderEvents } from "../enums";

export interface EditMode<A> {
    action: A;
    i18nKey: string;
    icon?: OverridableComponent<SvgIconTypeMap>,
    iconPosition?: 'start' | 'end';
    disabled?: boolean
}
export interface TableHeadersProps<A = any> {
    /** i18n key */
    title: string;
    editModeList: Array<EditMode<A>>;
    onTableHeaderEvents?: (event: A | TableHeaderEvents, payload?: any) => void;
    isFilterApplied?: boolean;
    canShowFilter?: boolean;
}