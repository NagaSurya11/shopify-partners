export interface ProductIdQuantityInput {
    product_id: string;
    quantity: number;
}
export interface TotalPriceAndDiscountPriceInput {
    products: Array<ProductIdQuantityInput>;
    discount_percentage: number;
}