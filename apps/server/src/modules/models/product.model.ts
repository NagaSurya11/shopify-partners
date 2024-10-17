import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { IProduct } from "../types/interfaces";


interface ProductCreationAttributes extends Optional<IProduct, 'product_id'> { };

export class ProductModel extends Model<IProduct, ProductCreationAttributes> implements IProduct {
    public product_id!: string;
    public name!: string;
    public main_category!: string;
    public sub_category!: string;
    public image!: string;
    public ratings!: number;
    public no_of_ratings!: number;
    public actual_price!: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

export async function initProductModel(sequelize: Sequelize) {
    ProductModel.init(
        {
            product_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            main_category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sub_category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ratings: {
                type: DataTypes.FLOAT, // Changed to FLOAT for precision
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 5
                }
            },
            no_of_ratings: {
                type: DataTypes.INTEGER, // Changed to INTEGER for ratings count
                defaultValue: 0
            },
            actual_price: {
                type: DataTypes.FLOAT, // Changed to FLOAT for precision
                allowNull: false,
                validate: {
                    min: 0 // Prevent negative prices
                }
            }
        },
        {
            sequelize: sequelize,
            modelName: 'Product',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                { fields: ['name'] },
                { fields: ['ratings'] },
                { fields: ['no_of_ratings'] },
                { fields: ['main_category'] },
                { fields: ['sub_category'] },
                { fields: ['actual_price'] }
            ]
        }
    );
    await ProductModel.sync({ force: false, alter: false });
}


