export type CarType = {
  id: string;
  url: string;
  source: string;
  brand: string;
  city: string;
  price: number;
  price_rating_object: {
    rating: string;
    rating_reason: string;
  };
};
