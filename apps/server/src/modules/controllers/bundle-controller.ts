import { Op, WhereOptions } from "sequelize";
import { BundleModel, BundleProductModel, ProductModel } from "../models";
import { CreateBundleInput, ListBundleInput, OBundle } from "../types/interfaces";
import { ProductController } from "./product-controller";
import { betweenInputValidator } from "../validators";
import { sequelize } from '../db/sequelize';
import { isEqual } from 'lodash';

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

async function UpdateBundle(input: CreateBundleInput, bundle_id: string) {
    const bundle = await GetBundleById(bundle_id);
    if (!isEqual(bundle.name, input.name)) {
        await CheckForDuplicateName(input.name);
    }

    const { discountPrice } = await ProductController.GetTotalPriceAndDiscountPrice({
        products: input.products,
        discount_percentage: input.discount_percentage
    });

    const transaction = await sequelize.transaction();
    try {
        // remove existing products
        await BundleProductModel.destroy({
            where: {
                bundle_id: {
                    [Op.eq]: bundle_id
                }
            },
            transaction
        });

        // insert new products
        await BundleProductModel.bulkCreate(
            input.products.map(product => ({
                ...product,
                bundle_id: bundle_id
            })), 
            { transaction }
        );

        // update bundle details
        await BundleModel.update(
            {
                bundle_price: discountPrice, // Using the calculated discountPrice
                discount_percentage: input.discount_percentage,
                name: input.name,
                total_sold: BigInt(0)
            },
            {
                where: { bundle_id },
                transaction // Add transaction here
            }
        );

        // commit the transaction
        await transaction.commit();

        // fetch the updated bundle
        const updatedBundle = await GetBundleById(bundle_id);
        return updatedBundle;
    } catch (error) {
        // rollback in case of error
        await transaction.rollback();
        console.error('Error updating bundle:', error);
        throw new Error('UPDATE_FAILED');
    }
}


async function CreateBundle(input: CreateBundleInput) {

    if (!input.products || input.products.length === 0) {
        throw new Error(`Cannot create bundle without products!`);
    }

    await CheckForDuplicateName(input.name);

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

async function CheckForDuplicateName(name: string) {
    if (await BundleModel.findOne({ where: { name } })) {
        throw new Error(`Bundle ${name} already exists!`);
    }
}

async function DeleteBundles(bundleIds: string[]) {
    if (!!bundleIds && bundleIds.length > 0) {
        const transaction = await sequelize.transaction();

        try {
            // Destroy entries in BundleProductModel
            await BundleProductModel.destroy({
                where: {
                    bundle_id: {
                        [Op.in]: bundleIds
                    }
                },
                transaction
            });

            // Destroy entries in BundleModel
            await BundleModel.destroy({
                where: {
                    bundle_id: {
                        [Op.in]: bundleIds
                    }
                },
                transaction
            });

            await transaction.commit();
            return 'BUNDLES_DELETED_SUCCESSFULLY!';
        } catch (error) {
            await transaction.rollback();
            throw new Error('DELETE_FAILED');
        }
    } else {
        throw new Error('NO_IDS_PROVIDED');
    }
}

async function SearchBundlesByName(searchTerm: string) {
    let where: WhereOptions<OBundle> = {};
    where['name'] = {
        [Op.iLike]: `${searchTerm}%`
    }
    return await BundleModel.findAll({
        where,
        limit: 20,
        order: [['name', 'ASC']],
        attributes: ['bundle_id', 'name']
    });
}

export const BundleController = {
    CreateBundle,
    GetBundleById,
    OrderBundle,
    FetchBundles,
    CheckForDuplicateName,
    DeleteBundles,
    SearchBundlesByName,
    UpdateBundle
}