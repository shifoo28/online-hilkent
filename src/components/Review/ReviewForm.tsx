"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ReviewFormProps {
  productId: number;
  userId: number;
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({
  productId,
  userId,
  onReviewSubmitted,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const translate = useTranslations("ShopDetails.overview.review.form");
  const MAX_COMMENT_LENGTH = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[550px] w-full">
      <h2 className="font-medium text-2xl text-dark mb-3.5">
        {translate("title")}
      </h2>

      <p className="mb-6">
        {translate("description")} <span className="text-red">*</span>
      </p>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-7.5">
        <span>
          {translate("rating.label")} <span className="text-red">*</span>:
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl focus:outline-none"
            >
              <svg
                className={`w-6 h-6 ${
                  star <= rating ? "text-yellow" : "text-gray-5"
                }  fill-current`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-dark-2">
            ({rating} {translate("stars")})
          </span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-dark mb-2"
            >
              {translate("comment.label")} <span className="text-red">*</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_COMMENT_LENGTH) {
                  setComment(value);
                }
              }}
              placeholder={translate("comment.placeholder")}
              className="w-full max-h-55 p-3 border border-gray-3 rounded-md resize-y focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none"
              rows={4}
              maxLength={MAX_COMMENT_LENGTH}
              required
            />
            <span className="flex items-center justify-between mt-2.5">
              <span className="text-custom-sm text-dark-4">
                {translate("maximum")}
              </span>
              <span className="text-custom-sm text-dark-4">
                {comment.length}/{MAX_COMMENT_LENGTH}
              </span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 bg-blue text-white font-medium rounded-md hover:bg-blue-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              translate("submit")
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
