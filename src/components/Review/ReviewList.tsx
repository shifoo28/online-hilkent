"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import GenerateStars from "./generateStars";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    avatar: string | null;
  };
  product?: {
    id: number;
    name: string;
    image: string | null;
  };
}

interface ReviewListProps {
  productId?: number;
  userId?: number;
  limit?: number;
}

const ReviewList = ({ productId, userId, limit }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, userId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (productId) params.append("productId", productId.toString());
      if (userId) params.append("userId", userId.toString());

      const response = await fetch(`/api/reviews?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data);

      // Calculate average rating if showing product reviews
      if (productId && data.length > 0) {
        const total = data.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0,
        );
        setAverageRating(total / data.length);
        setTotalReviews(data.length);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return <GenerateStars rating={rating} size={4}/>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-1 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-3 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-3 rounded w-1/4"></div>
                <div className="h-3 bg-gray-3 rounded w-1/6"></div>
                <div className="h-4 bg-gray-3 rounded w-full"></div>
                <div className="h-4 bg-gray-3 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

  return (
    <div className="space-y-6">
      {/* Rating Summary (only for product reviews) */}
      {productId && totalReviews > 0 && (
        <h2 className="font-medium text-2xl text-dark mb-9">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""} for this product
        </h2>
      )}

      {/* Reviews List */}
      {displayedReviews.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-1 text-center">
          <p className="text-dark-2">No reviews yet.</p>
          {productId && (
            <p className="text-sm text-dark-3 mt-1">
              Be the first to review this product!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-1">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <Image
                    src={
                      review.user.avatar || "/images/users/default-avatar.jpg"
                    }
                    alt={review.user.name || "User"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-dark">
                        {review.user.name || "Anonymous"}
                      </h4>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-dark-3">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-dark-2 leading-relaxed">
                      {review.comment}
                    </p>
                  )}

                  {/* Product info (for user profile reviews) */}
                  {review.product && !productId && (
                    <div className="mt-3 pt-3 border-t border-gray-2">
                      <p className="text-sm text-dark-3">
                        Review for: {review.product.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show more link */}
      {limit && reviews.length > limit && (
        <div className="text-center">
          <button className="text-blue hover:text-blue-dark font-medium">
            View all {reviews.length} reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
