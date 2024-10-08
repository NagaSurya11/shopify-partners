import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { BundleModel } from "./bundle.model";
import { ProductModel } from "./product.model";


interface BundleProductAttributes {
    bundle_id: string;
    product_id: string;
    quantity: number;
    
    created_at?: Date;
    updated_at?: Date;
}

export class BundleProductModel extends Model<BundleProductAttributes, Optional<BundleProductAttributes, any>> implements BundleProductAttributes {
    public bundle_id!: string;
    public product_id!: string;
    public quantity!: number;

    
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

export async function initBundleProductModel(sequelize: Sequelize) {

    BundleProductModel.init(
        {
            bundle_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: BundleModel,
                    key: 'bundle_id'
                },
                onDelete: 'CASCADE'
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: ProductModel,
                    key: 'product_id'
                },
                onDelete: 'CASCADE'
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                validate: {
                    min: 1, // Quantity should be at least 1
                },
            },
        },
        {
            sequelize: sequelize,
            modelName: 'BundleProduct',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                {fields: ['bundle_id']},
                {fields: ['product_id']},
                {fields: ['quantity']}
            ]
        }
    )

    BundleModel.belongsToMany(ProductModel, { through: BundleProductModel, foreignKey: 'bundle_id' });
    ProductModel.belongsToMany(BundleModel, { through: BundleProductModel, foreignKey: 'product_id' });

    await BundleProductModel.sync({ force: true, alter: true });
}