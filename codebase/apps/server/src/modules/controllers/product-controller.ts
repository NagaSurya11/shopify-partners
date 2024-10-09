import { ProductModel } from "../models";
import { GetTotalAndDiscountPriceInput, IProduct, OProduct } from "../types/interfaces";
import { ListProductsInput } from "../types/interfaces/list-products-input.interface";
import { col, fn, Op, WhereOptions } from 'sequelize';
import { betweenInputValidator } from "../validators";

async function AddProducts(product: OProduct[]) {
    return await ProductModel.bulkCreate(product);
}

async function AddProduct(product: OProduct) {
    return await ProductModel.create(product);
}

async function FetchProducts(input: ListProductsInput) {
    let where: WhereOptions<OProduct> = {};

    if (input.filter) {
        //  filter categories
        let categoryFilters: {
            main_category: string;
            sub_category: {
                [Op.in]: string[];
            };
        }[] = [];
        if (input.filter.categories && input.filter.categories.length > 0) {
            categoryFilters = input.filter.categories.map(category => ({
                main_category: category.name,
                sub_category: {
                    [Op.in]: category.subCategories  // Matches any of the subcategories provided
                }
            }));
        }
        if (!!categoryFilters && categoryFilters.length > 0) {
            where = {
                [Op.or]: categoryFilters
            }
        }

        // filter price
        if (input.filter.actualPrice) {
            const { from, to } = input.filter.actualPrice;
            betweenInputValidator(from, to);
            where['actual_price'] = {
                [Op.gte]: from,
                [Op.lte]: to
            };
        }

        // filter ratings
        if (input.filter.ratings) {
            const { from, to } = input.filter.ratings;
            betweenInputValidator(from, to);
            where['ratings'] = {
                [Op.gte]: from,
                [Op.lte]: to
            };
        }

        // productIds filter
        if (!!input.filter.selectedProductIds && input.filter.selectedProductIds.length > 0) {
            where['product_id'] = {
                [Op.in]: input.filter.selectedProductIds
            }
        }
    }

    const { count, rows } = await ProductModel.findAndCountAll({
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

async function GetProductById(product_id: string) {
    return await ProductModel.findOne({ where: { product_id } })
}

async function UpdateProduct(product_id: string, product: OProduct) {
    const [_, affectedRows] = await ProductModel.update(product, { where: { product_id }, returning: true });
    return affectedRows[0];
}

async function GetTotalPriceAndDiscountPrice(input: GetTotalAndDiscountPriceInput) {
    // Extract product_ids from the input list
    const productIds = input.products.map(item => item.product_id);

    // Fetch products from the database with matching product_ids and only select the necessary fields
    const products = await ProductModel.findAll({
        where: {
            product_id: productIds
        },
        attributes: ['product_id', 'actual_price']
    });

    if (products.length === 0) {
        throw new Error('No products found');
    }

    // Create a map of product prices
    const productPriceMap = new Map(products.map(product => [product.product_id, product.actual_price]));

    // Calculate the total price by summing (price * quantity) in a single reduce pass
    const totalPrice = input.products.reduce((sum, item) => {
        const price = productPriceMap.get(item.product_id);

        if (price !== undefined) {
            // Multiply price by quantity and add to the sum
            return sum + (price * item.quantity);
        } else {
            console.warn(`Product with ID ${item.product_id} not found`);
            return sum;
        }
    }, 0); // Initial sum is 0

    return { totalPrice, discountPrice: totalPrice - ((totalPrice * input.discount_percentage) / 100) };
}

async function GetMainCategories() {
    const response = await ProductModel.findAll({
        attributes: [[fn('DISTINCT', col('main_category')), 'main_category']],
        raw: true
    });
    return response.map(product => product.main_category);
}

async function GetSubCategories(main_category: string) {
    const response = await ProductModel.findAll({
        where: { main_category },
        attributes: [[fn('DISTINCT', col('sub_category')), 'sub_category']],
        raw: true
    });
    return response.map(product => product.sub_category);
}

export const ProductController = {
    AddProducts,
    AddProduct,
    FetchProducts,
    GetProductById,
    UpdateProduct,
    GetTotalPriceAndDiscountPrice,
    GetMainCategories,
    GetSubCategories
}