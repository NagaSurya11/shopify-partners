import { PageSize } from "../../../table/types/enums";
import { SelectionInput, Sort } from "../../../table/types/interfaces";
import { BetweenFloatInput } from "./between-float-input.interface";

export interface Page {
    number: number;
    size: PageSize
}

export interface CategoryInput extends SelectionInput{
}

export interface ProductFilterInput {
    categories?: Array<CategoryInput>;
    actualPrice?: BetweenFloatInput;
    ratings?: BetweenFloatInput;
    selectedProductIds?: Array<string>;
}

export interface ListProductsInput {
    page: Page;
    sort?: Sort;
    filter?: ProductFilterInput;
}
