import { Op, WhereOptions } from "sequelize";
import { BundleModel, BundleProductModel, ProductModel } from "../models";
import { CreateBundleInput, ListBundleInput, OBundle } from "../types/interfaces";
import { ProductController } from "./product-controller";
import { betweenInputValidator } from "../validators";

async function GetBundleById(bundle_id: string) {
    const response = await BundleModel.findOne({
        where: { bundle_id: bundle_id },
        include: [{
            model: ProductModel, // Include associated products
            through: {
                attributes: ['quantity'], // Include quantity from the join table
            },
            attributes: [
                'product_id'
            ]
        }]
    });
    response['Products'] = response['Products'].map((product: any) => ({
        product_id: product.product_id,
        quantity: product.BundleProduct.quantity
    }));
    return response;
}

async function CreateBundle(input: CreateBundleInput) {

    if (!input.products || input.products.length === 0) {
        throw new Error(`Cannot create bundle without products!`);
    }

    const { discountPrice } = await ProductController.GetTotalPriceAndDiscountPrice({
        products: input.products,
        discount_percentage: input.discount_percentage
    })
    // create bundle
    const createdBundle = await BundleModel.create({
        name: input.name,
        discount_percentage: input.discount_percentage,
        bundle_price: discountPrice
    });

    // add products to bundleproduct table
    await BundleProductModel.bulkCreate(input.products.map(product => ({
        ...product,
        bundle_id: createdBundle.bundle_id
    })));

    // return result
    return await GetBundleById(createdBundle.bundle_id);

}

async function FetchBundles(input: ListBundleInput) {
    let where: WhereOptions<OBundle> = {};

    if (input.filter) {
        if (input.filter.bundle_price) {
            const { from, to } = input.filter.bundle_price;
            betweenInputValidator(from, to);
            where['bundle_price'] = {
                [Op.gte]: from,
                [Op.lte]: to
            }
        }

        if (input.filter.discount_percentage) {
            const { from, to } = input.filter.discount_percentage;
            betweenInputValidator(from, to);
            where['discount_percentage'] = {
                [Op.gte]: from,
                [Op.lte]: to
            }
        }
        if (input.filter.total_sold) {
            const { from, to } = input.filter.total_sold;
            betweenInputValidator(from, to);
            where['total_sold'] = {
                [Op.gte]: from,
                [Op.lte]: to
            }
        }
    }

    const { count, rows } = await BundleModel.findAndCountAll({
        where,
        limit: input.page.size,           // Number of records to return
        offset: (input.page.number - 1) * input.page.size, // Calculate the starting index
        order: input.sort ? [[input.sort.sortBy, input.sort.sortOrder]] : undefined  // Sorting by a specific column and order
    });

    return {
        rows,        // Paginated products
        totalRows: count,  // Total product count
    };
}

async function OrderBundle(bundle_id: string) {
    const bundle = await BundleModel.findByPk(bundle_id);
    await bundle.increment('total_sold', { by: 1 });
    return GetBundleById(bundle_id);
}

export const BundleController = {
    CreateBundle,
    GetBundleById,
    OrderBundle,
    FetchBundles
}