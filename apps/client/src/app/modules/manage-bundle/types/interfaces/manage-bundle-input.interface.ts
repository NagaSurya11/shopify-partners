import { TotalPriceAndDiscountPriceInput } from "./total-price-and-discount-price-input.interface";

export interface CreateBundleInput extends TotalPriceAndDiscountPriceInput {
    name: string;
}