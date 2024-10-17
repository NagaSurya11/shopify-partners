import { Product } from "./product.interface";

export interface ListProductsOutput {
    rows: Array<Product>;
    totalRows: number;
}