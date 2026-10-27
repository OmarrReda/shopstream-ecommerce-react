import { FaRegStar, FaStar } from "react-icons/fa6";

export default function productRating({ rating, reviews }) {
  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= Math.round(rating) ? (
          <FaStar key={star} color="green" />
        ) : (
          <FaRegStar key={star} color="green" />
        ),
      )}
      <span className="fw-bold text-muted">{rating}</span>
      <span className="fw-light text-muted text-decoration-underline ms-2">{reviews} Reviews</span>
    </div>
  );
}
