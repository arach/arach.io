import { useState } from "react";

export default function StarRating({
  rating: initialRating,
}: {
  rating: number;
}) {
  const [rating, setRating] = useState(initialRating);

  return (
    <>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{
              cursor: "pointer",
              fontSize: "1rem",
              color: index < rating ? "#FFD700" : "#D3D3D3",
            }}
            onClick={() => setRating(index + 1)}
          >
            {index < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    </>
  );
}
