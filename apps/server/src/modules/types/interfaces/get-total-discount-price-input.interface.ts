import { ProductQuantity } from "./create-bundle-input.interface";

export interface GetTotalAndDiscountPriceInput {
    products: Array<ProductQuantity>;
    discount_percentage: number;
}