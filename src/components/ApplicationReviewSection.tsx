"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ApplicationReview } from "@/types/review";
import DOMPurify from "dompurify";

const STORAGE_KEY = "seapedia-application-reviews";

const initialReviews: ApplicationReview[] = [
    {
        id: "initial-1",
        reviewerName: "Alya",
        rating: 5,
        comment:
        "SEAPEDIA feels promising. The role-based experience sounds useful for people who buy, sell, and deliver in one marketplace.",
        createdAt: "2026-07-05T00:00:00.000Z",
    },
    {
        id: "initial-2",
        reviewerName: "Bima",
        rating: 4,
        comment:
        "The application concept is clear. I like that users can switch roles instead of creating separate accounts.",
        createdAt: "2026-07-05T00:00:00.000Z",
    },
    ];

    function createReviewId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }

    return String(Date.now());
    }

    function renderStars(rating: number) {
    return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
    }

    export default function ApplicationReviewSection() {
    const [reviews, setReviews] = useState<ApplicationReview[]>(initialReviews);
    const [reviewerName, setReviewerName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const storedReviews = localStorage.getItem(STORAGE_KEY);

        if (!storedReviews) {
        return;
        }

        try {
        const parsedReviews = JSON.parse(storedReviews) as ApplicationReview[];

        if (Array.isArray(parsedReviews)) {
            setReviews(parsedReviews);
        }
        } catch {
        localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const averageRating = useMemo(() => {
        if (reviews.length === 0) {
        return "0.0";
        }

        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = reviewerName.trim();
        const trimmedComment = comment.trim();

        if (!trimmedName || !trimmedComment) {
        return;
        }

        if (rating < 1 || rating > 5) {
            alert("Invalid rating");
            return;
        }

        const cleanName = DOMPurify.sanitize(trimmedName);
        const cleanComment = DOMPurify.sanitize(trimmedComment);

        if (!cleanName || !cleanComment) {
            return;
        }

        const newReview: ApplicationReview = {
        id: createReviewId(),
        reviewerName: cleanName,
        rating,
        comment: cleanComment,
        createdAt: new Date().toISOString(),
        };

        const nextReviews = [newReview, ...reviews];

        setReviews(nextReviews);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReviews));

        setReviewerName("");
        setRating(5);
        setComment("");
    }

    return (
        <section className="w-full bg-white px-6 py-16 text-slate-950">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Public Application Reviews
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Tell us about your SEAPEDIA experience
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                These reviews are about the website and application experience, not
                specific products or orders. Guests can submit feedback without
                checkout or transaction history.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
                <div className="border border-slate-200 bg-slate-50 p-5">
                <p className="text-3xl font-bold">{averageRating}</p>
                <p className="mt-1 text-sm text-slate-600">Average rating</p>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-5">
                <p className="text-3xl font-bold">{reviews.length}</p>
                <p className="mt-1 text-sm text-slate-600">Public reviews</p>
                </div>
            </div>
            </div>

            <form
            onSubmit={handleSubmit}
            className="border border-slate-200 bg-slate-50 p-6"
            >
            <div className="grid gap-5">
                <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                    Reviewer name
                </span>
                <input
                    value={reviewerName}
                    onChange={(event) => setReviewerName(event.target.value)}
                    maxLength={60}
                    className="h-11 border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-700"
                    placeholder="Your name"
                />
                </label>

                <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                    Rating
                </span>
                <select
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                    className="h-11 border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-700"
                >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Okay</option>
                    <option value={2}>2 - Needs improvement</option>
                    <option value={1}>1 - Poor</option>
                </select>
                </label>

                <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                    Comment
                </span>
                <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength={280}
                    rows={5}
                    className="resize-none border border-slate-300 bg-white p-3 text-sm outline-none focus:border-emerald-700"
                    placeholder="Share feedback about the SEAPEDIA application experience"
                />
                </label>

                <button
                type="submit"
                className="h-11 bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                Submit review
                </button>
            </div>
            </form>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
            <article
                key={review.id}
                className="border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold">
                    {review.reviewerName}
                    </h3>
                    <p className="mt-1 text-sm text-amber-600">
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
        </section>
    );
}