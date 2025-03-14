export type PriceRating = {
  rating: string;
  rating_reason: string;
  threshold: string[];
};

export type CarType = {
  url: string;
  source: string;
  externalCarId: string;
  brand: string;
  city: string;
  price: number;
  price_history: object[];
  price_rating: PriceRating;
  has_car_accident: boolean;
};
