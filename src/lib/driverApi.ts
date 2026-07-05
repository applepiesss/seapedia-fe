import { apiRequest } from "./api";
import { DriverDashboard, DriverJob } from "@/types/driver";

const h = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getAvailableJobs = (token: string) =>
  apiRequest<DriverJob[]>("/api/driver/jobs/available", { headers: h(token) });

export const getJobDetails = (token: string, jobId: number) =>
  apiRequest<DriverJob>(`/api/driver/jobs/${jobId}`, { headers: h(token) });

export const takeJob = (token: string, jobId: number) =>
  apiRequest<DriverJob>(`/api/driver/jobs/${jobId}/take`, {
    method: "POST",
    headers: h(token),
  });

export const completeJob = (token: string, jobId: number) =>
  apiRequest<DriverJob>(`/api/driver/jobs/${jobId}/complete`, {
    method: "POST",
    headers: h(token),
  });

export const getDriverDashboard = (token: string) =>
  apiRequest<DriverDashboard>("/api/driver/dashboard", { headers: h(token) });
