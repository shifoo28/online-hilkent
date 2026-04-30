"use client";

import ReviewList from "../Review/ReviewList";

interface ReviewsTabProps {
  userId?: string | null;
}

export default function ReviewsTab({ userId }: ReviewsTabProps) {
  return (
    <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10">
      <ReviewList userId={userId} />
    </div>
  );
}
