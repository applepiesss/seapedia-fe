"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ApplicationReview } from "@/types/review";
import DOMPurify from "dompurify";
import { getReviews, submitReview } from "@/lib/publicApi";
import { useToast } from "@/components/ToastProvider";

function renderStars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

export default function ApplicationReviewSection() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ApplicationReview[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (e) {
      console.error("Failed to fetch reviews", e);
    }
  }

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = reviewerName.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment) {
      showToast("Reviewer name and comment cannot be empty.", "warning");
      return;
    }

    if (rating < 1 || rating > 5) {
      showToast("Rating must be between 1 and 5.", "warning");
      return;
    }

    const cleanName = DOMPurify.sanitize(trimmedName);
    const cleanComment = DOMPurify.sanitize(trimmedComment);

    if (!cleanName || !cleanComment) {
      showToast(
        "Your input was rejected because it contains potentially unsafe content (XSS).",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const newReview = await submitReview({
        reviewerName: cleanName,
        rating,
        comment: cleanComment,
      });

      setReviews([newReview, ...reviews]);
      setReviewerName("");
      setRating(5);
      setComment("");
      setCurrentPage(1);
      showToast("Review submitted successfully! Thank you!", "success");
    } catch (e: any) {
      showToast(e.message || "Failed to submit review. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="w-full bg-white px-6 py-16 text-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] relative z-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
            Application Reviews
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-slate-950">
            Tell us about your SEAPEDIA experience
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            We value your insights. This space is dedicated to your overall experience with the SEAPEDIA platform. Whether you are a first-time guest or a seasoned shopper, your feedback helps us build a better marketplace. No prior transactions required!
          </p>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <p className="text-3xl font-bold text-slate-950">{averageRating}</p>
              <p className="mt-1 text-sm text-slate-600">Average rating</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <p className="text-3xl font-bold text-slate-950">{reviews.length}</p>
              <p className="mt-1 text-sm text-slate-600">Public reviews</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-lg p-6 shadow-[0_8px_30px_rgba(74,159,232,0.1)]"
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">
                Reviewer name
              </span>
              <input
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                maxLength={60}
                required
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                placeholder="Your name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Rating</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Okay</option>
                <option value={2}>2 - Needs improvement</option>
                <option value={1}>1 - Poor</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Comment</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={280}
                rows={5}
                required
                className="resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                placeholder="Share feedback about the SEAPEDIA application experience"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-lg bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] px-5 text-sm font-semibold text-white transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 disabled:opacity-50 disabled:hover:shadow-none"
            >
              {loading ? "Submitting..." : "Submit review"}
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        {paginatedReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(74,159,232,0.08)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="break-words text-base font-semibold text-slate-900">
                  {review.reviewerName}
                </h3>
                <p className="mt-1 text-sm bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
                  {renderStars(review.rating)}
                </p>
              </div>
              <p className="shrink-0 text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
              {review.comment}
            </p>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mx-auto mt-10 flex max-w-6xl items-center justify-center gap-4 relative z-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white shadow-sm"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}