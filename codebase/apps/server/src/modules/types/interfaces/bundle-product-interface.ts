import { ProductQuantity } from "./create-bundle-input.interface";

export interface BundleProduct extends ProductQuantity{
    bundle_id: string;
}