import { OBundle } from "./bundle-interface";


export interface ProductQuantity {
    product_id: string;
    quantity: number;
}

export interface CreateBundleInput extends OBundle {
    products: Array<ProductQuantity>;
}
