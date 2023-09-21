export class PriceRatingDto {
  id: string;
  price_rating: string;
  price_rating_object: {
    rating: string;
    rating_reason: string;
  };
}
