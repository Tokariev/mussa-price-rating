export type PriceRating = {
  rating: string;
  rating_reason: string;
};

export type CarType = {
  id: number;
  url: string;
  source: string;
  brand: string;
  city: string;
  price: number;
  price_rating: PriceRating;
};
