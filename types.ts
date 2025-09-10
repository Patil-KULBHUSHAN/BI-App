
export interface RawProduct {
  name: string;
  main_category: string;
  sub_category: string;
  image: string;
  link: string;
  ratings: string | null;
  no_of_ratings: string;
  discount_price: string | null;
  actual_price: string | null;
}

export interface ProcessedProduct {
  id: string;
  name: string;
  main_category: string;
  sub_category: string;
  image: string;
  link: string;
  ratings: number;
  no_of_ratings: number;
  discount_price: number;
  actual_price: number;
  discount_percentage: number;
  estimated_demand: number;
}

export interface FilterState {
  category: string;
  subCategory: string;
  rating: number;
  priceRange: [number, number];
  discount: number;
}

export enum SortKey {
  RATING = 'ratings',
  REVIEWS = 'no_of_ratings',
  DISCOUNT = 'discount_percentage',
  DEMAND = 'estimated_demand',
  PRICE = 'actual_price',
}