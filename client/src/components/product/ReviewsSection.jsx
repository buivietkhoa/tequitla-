"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import api, { getErrorMessage } from "@/lib/api-client";
import useAuthStore from "@/store/useAuthStore";

export default function ReviewsSection({ productId, reviews = [], rating = 0, numReviews = 0 }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [ratingInput, setRatingInput] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const alreadyReviewed = user && reviews.some((r) => r.user === user.id);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating: ratingInput, comment });
      toast.success("Cảm ơn bạn đã đánh giá!");
      setComment("");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t border-neutral-200 pt-8">
      <h2 className="text-lg font-semibold">
        Đánh giá sản phẩm ({numReviews}) {numReviews > 0 && `- ${rating.toFixed(1)}★`}
      </h2>

      <div className="mt-4 space-y-4">
        {reviews.length === 0 && (
          <p className="text-sm text-neutral-500">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
        {reviews.map((review) => (
          <div key={review._id} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{review.name}</p>
              <span className="text-xs text-neutral-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
            </div>
            {review.comment && <p className="mt-1 text-sm text-neutral-600">{review.comment}</p>}
          </div>
        ))}
      </div>

      {user && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-lg border border-neutral-200 p-4">
          <p className="text-sm font-medium">Viết đánh giá của bạn</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRatingInput(n)}>
                <Star
                  size={22}
                  className={n <= ratingInput ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
            className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white disabled:bg-neutral-300"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      )}
    </section>
  );
}
