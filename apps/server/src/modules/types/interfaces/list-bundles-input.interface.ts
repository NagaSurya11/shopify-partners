import { Between, ListInput } from "./list-input.interface";

export interface BundleFilterInput {
    discount_percentage?: Between;
    total_sold?: Between;
    bundle_price?: Between
}

export interface ListBundleInput extends ListInput{
    filter?: BundleFilterInput;
}