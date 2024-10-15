import { FilterInputType } from "../enums";
import { BetweenInputData } from "./table-filter-props.interface";

export type TableFilterStateMap = Map<number, Map<string, Set<string>>| BetweenInputData>;
export interface TableFilterState {
    page: 'main' | 'sub-1' | 'sub-2' | 'between';
    subTitle: string, searchTerm: string;
    type?: FilterInputType;
    editingStateIndex?: number;
    subList: string[];
    /** key is index of options and map of set is for selection list and between output data is for between type */
    stateMap: TableFilterStateMap;
}