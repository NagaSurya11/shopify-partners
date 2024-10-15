import { ProductIdQuantityInput } from "./total-price-and-discount-price-input.interface";

export interface BundleOutput {
    bundle_id: string
    name: string
    discount_percentage: number;
    total_sold: number
    bundle_price: number
    Products: Array<ProductIdQuantityInput>;
}