import { PageSize, SortOrder } from "../enums";

export interface Between {
    from: number,
    to: number
}

export interface Sort {
    sortBy: string;
    sortOrder: SortOrder
}

export interface Page {
    number: number;
    size: PageSize;
}

export interface ListInput{
    page: Page;
    sort?: Sort;
}