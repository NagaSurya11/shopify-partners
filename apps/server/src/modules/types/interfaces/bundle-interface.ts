
export interface OBundle {
    name: string;
    discount_percentage: number;
    total_sold: BigInt;
    bundle_price: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IBundle extends OBundle {
    bundle_id: string;
}