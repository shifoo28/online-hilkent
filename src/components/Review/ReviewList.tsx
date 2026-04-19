"use client";
import React from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import GenerateStars from "./generateStars";
import { useLocale, useTranslations } from "next-intl";
import { getDateLocale } from "@/locales/map";
import { useApiData } from "@/hooks/useApiCall";
import { useApiError } from "@/hooks/useApiError";
import { reviewsService } from "@/services/api";
import type { ReviewResponse } from "@/types/api/responses";
import type { PaginatedApiResponse } from "@/types/api/responses";

interface ReviewListProps {
  productId?: string;
  userId?: string;
  limit?: number;
}

const ReviewList = ({ productId, userId, limit }: ReviewListProps) => {
  const locale = useLocale();
  const translate = useTranslations("ShopDetails.overview.review");
  const { handleError } = useApiError();

  // Fetch reviews with proper type safety
  const {
    data: reviewsResponse,
    loading,
    error,
  } = useApiData(
    () =>
      productId
        ? reviewsService.getProductReviews(productId, {
            page: 1,
            pageSize: 100,
          })
        : userId
          ? reviewsService.getUserReviews(userId, { page: 1, pageSize: 100 })
          : reviewsService.getReviews({ page: 1, pageSize: 100 }),
    [],
    {
      onError: (error) => {
        handleError(error, {
          showToast: true,
          userMessage: translate("loadError") || "Failed to load reviews",
        });
      },
    },
  );

  // Extract typed reviews data
  const reviews: ReviewResponse[] = reviewsResponse?.data ?? [];
  const totalReviews = reviews.length;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(getDateLocale(locale), {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number): React.ReactNode => {
    return <GenerateStars rating={rating} size={4} />;
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

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-1 text-center">
        <p className="text-red">{error.getUserMessage()}</p>
      </div>
    );
  }

  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

  return (
    <div className="space-y-6">
      {/* Rating Summary (only for product reviews) */}
      {productId && totalReviews > 0 && (
        <h2 className="font-medium text-2xl text-dark mb-9">
          {translate("listDescription")} ({totalReviews})
        </h2>
      )}

      {/* Reviews List */}
      {displayedReviews.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-1 text-center">
          <p className="text-dark-2">{translate("noReviews")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review: ReviewResponse) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-1">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <Image
                    src={review.user.avatar || "/images/default-avatar.png"}
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
                        Review for: {review.product.Translations[0]?.name}
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
