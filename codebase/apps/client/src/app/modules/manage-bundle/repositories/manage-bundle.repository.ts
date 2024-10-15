import { AbstractCRUDRepository } from "../../graphql-client/repositories";
import { BundleOutput, BundleSearchOption, CreateBundleInput, ListProductsInput, ListProductsOutput, Product, TotalPriceAndDiscountPriceInput } from "../types/interfaces";

export class ManageBundleRepository extends AbstractCRUDRepository {

    private listProductsQuery() {
        return `
        query listProducts($input: ListProductsInput!){
            ListProducts(listProductsInput: $input) {
                rows {
                product_id
                name
                main_category
                sub_category
                ratings
                no_of_ratings
                actual_price
                }
                totalRows
            }
        }
        `;
    }

    private getMainCategoriesQuery() {
        return `
        query GetMainCategories($selectedProductIds: [String]){
            GetMainCategories(selectedProductIds: $selectedProductIds)
        }
        `;
    }

    private getSubCategoriesQuery() {
        return `
        query GetSubCategories($main_category: String!, $selectedProductIds: [String]){
            GetSubCategories(main_category: $main_category, selectedProductIds: $selectedProductIds)
        }
        `;
    }

    private getProductDetailsByIdQuery() {
        return `
        query GetProductById($productId: ID!){
            GetProductById(id: $productId) {
                product_id
                name
                main_category
                sub_category
                image
                ratings
                no_of_ratings
                actual_price
            }
        }
        `;
    }

    private getTotalPriceAndDiscountPriceQuery() {
        return `
        query GetTotalPriceAndDiscountPrice($input: TotalPriceAndDiscountPriceInput!){
            GetTotalPriceAndDiscountPrice(input: $input) {
                totalPrice
                discountPrice
            }
        }
        `;
    }

    private createBundleQuery() {
        return `
        mutation CreateBundle($input: CreateBundleInput!){
            CreateBundle(input: $input) {
                bundle_id
                name
            }
        }
        `;
    }

    private getBundleByIdQuery() {
        return `
        query GetBundleById($bundleId: ID!){
            GetBundleById(id: $bundleId) {
                bundle_id
                name
                discount_percentage
                total_sold
                bundle_price
                Products {
                product_id
                quantity
                }
            }
        }
        `;
    }

    private bundleSearchQuery() {
        return `
        query SearchBundles($searchTerm: String!){
            SearchBundles(searchTerm: $searchTerm) {
                bundle_id
                name
            }
        }
        `;
    }

    private updateBundleQuery() {
        return `
        mutation UpdateBundle($input: CreateBundleInput!, $bundle_id: ID!){
            UpdateBundle(
                input: $input
                bundle_id: $bundle_id
            ) {
                bundle_id
                name
            }
        }
        `;
    }

    listProducts(input: ListProductsInput) {
        return super.watchQuery<{ ListProducts: ListProductsOutput }>(this.listProductsQuery(), { input });
    }

    getMainCategories(selectedProductIds?: Array<string>) {
        return super.watchQuery<{ GetMainCategories: Array<string> }>(this.getMainCategoriesQuery(), { selectedProductIds });
    }

    getSubCategories(main_category: string, selectedProductIds?: Array<string>) {
        return super.watchQuery<{ GetSubCategories: Array<string> }>(this.getSubCategoriesQuery(), { main_category, selectedProductIds });
    }

    getProductDetailsByProductId(productId: string) {
        return super.watchQuery<{ GetProductById: Product }>(this.getProductDetailsByIdQuery(), { productId });
    }

    getTotalPriceAndDiscountPrice(input: TotalPriceAndDiscountPriceInput) {
        return super.watchQuery<{ GetTotalPriceAndDiscountPrice: { totalPrice: number, discountPrice: number } }>(this.getTotalPriceAndDiscountPriceQuery(), { input });
    }

    createBundle(input: CreateBundleInput) {
        return super.mutate<{ CreateBundle: { bundle_id: string, name: string } }>(this.createBundleQuery(), { input });
    }

    getBundleById(bundleId: string) {
        return super.watchQuery<{GetBundleById: BundleOutput}>(this.getBundleByIdQuery(), { bundleId });
    }

    searchBundles(searchTerm: string) {
        return super.watchQuery<{SearchBundles: BundleSearchOption[]}>(this.bundleSearchQuery(), { searchTerm });
    }

    updateBundle(input: CreateBundleInput, bundle_id: string) {
        return super.mutate<{ CreateBundle: { bundle_id: string, name: string } }>(this.updateBundleQuery(), { input, bundle_id });
    }
}