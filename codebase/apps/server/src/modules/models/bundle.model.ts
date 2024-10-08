import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { IBundle } from "../types/interfaces";

interface BundleCreationAttributes extends Optional<IBundle, 'bundle_id'> { };

export class BundleModel extends Model<IBundle, BundleCreationAttributes> implements IBundle {
    public bundle_id!: string;
    public name!: string;
    public discount_percentage!: number;
    public total_sold!: BigInt;
    public bundle_price!: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

export async function initBundleModel(sequelize: Sequelize) {
    BundleModel.init(
        {
            bundle_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            discount_percentage: {
                type: DataTypes.DECIMAL(4, 2),
                allowNull: false
            },
            total_sold: {
                type: DataTypes.BIGINT, // To track total bundles sold
                defaultValue: 0 // Default value for new bundles
            },
            bundle_price: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Bundle',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                { fields: ['name'] },
                { fields: ['discount_percentage'] }
            ]
        }
    );

    await BundleModel.sync({ force: false, alter: true });
}