export type CarType = {
  id: string;
  url: string;
  source: string;
  brand?: string;
  price_rating?: string;
  price_rating_object?: {
    rating: string;
    rating_reason: string;
  };
};
