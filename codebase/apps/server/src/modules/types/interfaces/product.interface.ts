export interface OProduct {
    name: string;
    main_category: string;
    sub_category: string;
    image: string;
    ratings: number;
    no_of_ratings: number;
    actual_price: number;
}
export interface IProduct extends OProduct {
    product_id: string;
}