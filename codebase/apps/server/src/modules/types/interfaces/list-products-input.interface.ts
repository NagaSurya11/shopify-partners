import { Between, ListInput } from "./list-input.interface";


export interface MainCategory {
    name: string;
    subCategories: Array<string>;
}

export interface ProductFilterInput {
    categories?: Array<MainCategory>;
    ratings?: Between;
    actualPrice?: Between;
    selectedProductIds?: Array<BigInt>;
}

export interface ListProductsInput extends ListInput{
    filter?: ProductFilterInput
}