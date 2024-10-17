import { FilterInputType } from "../enums";

export type FilterOutputType = {[key: string]: BetweenOutputData | Array<SelectionInput>}

export interface BetweenOutputData {
    from: number;
    to: number;
}
export interface BetweenInputData extends BetweenOutputData{
    min: number;
    max: number;
    step?: number;
    hasLabel?: boolean;
}
export interface SelectionInput {
    name: string;
    subCategories: Array<string>;
}

export interface MultiSelection {
    name: string;
    selectedOptions: Array<SelectionInput>;
}

export interface FilterOptions {
    i18nKey: string;
    type: FilterInputType;
    data: BetweenInputData | MultiSelection;
    key: string;
}
export interface TableFilterProps {
    isLoading: boolean;
    isOpened: boolean;
    onClose: (value?: FilterOutputType) => void;
    dialogTitle: string;
    options: Array<FilterOptions>;
    subList?: Array<string>;
    onMultiSelectionNext: (key: 'sub1' | 'sub2', value?: string) => void;
}