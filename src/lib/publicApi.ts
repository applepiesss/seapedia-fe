import { apiRequest } from "./api";

export interface ReviewPayload {
  reviewerName: string;
  rating: number;
  comment: string;
}

export async function getReviews() {
  return apiRequest<any[]>("/api/public/reviews");
}

export async function submitReview(data: ReviewPayload) {
  return apiRequest<any>("/api/public/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
