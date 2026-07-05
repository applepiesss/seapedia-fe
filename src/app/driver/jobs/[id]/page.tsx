"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState, use } from "react";
import { getJobDetails, takeJob, completeJob } from "@/lib/driverApi";
import { DriverJob } from "@/types/driver";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [job, setJob] = useState<DriverJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const fetchJob = async () => {
    try {
      const token = getAuth()?.token;
      if (!token) return;
      const data = await getJobDetails(token, Number(unwrappedParams.id));
      setJob(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load job details.");
      router.push("/driver/jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [unwrappedParams.id]);

  const handleTakeJob = async () => {
    setProcessing(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await takeJob(token, Number(unwrappedParams.id));
      alert("Job taken successfully!");
      fetchJob();
    } catch (e: any) {
      alert(`Failed to take job: ${e.message || "Unknown error"}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteJob = async () => {
    setProcessing(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await completeJob(token, Number(unwrappedParams.id));
      alert("Delivery completed! Earnings added to your dashboard.");
      router.push("/driver");
    } catch (e: any) {
      alert(`Failed to complete job: ${e.message || "Unknown error"}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div><Header /><div className="p-8">Loading job details...</div></div>;
  if (!job) return <div><Header /><div className="p-8">Job not found.</div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <Link href={job.status === 'AVAILABLE' ? "/driver/jobs" : "/driver"} className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back</Link>
            <h1 className="text-3xl font-bold text-gray-800">Job #{job.id}</h1>
            <p className="text-gray-500 mt-1">Associated with Order #{job.orderId}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
            job.status === 'AVAILABLE' ? 'bg-blue-100 text-blue-800' : 
            job.status === 'TAKEN' ? 'bg-orange-100 text-orange-800' : 
            'bg-green-100 text-green-800'
          }`}>
            {job.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Pickup From</p>
                  <p className="font-semibold text-gray-800">{job.storeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Delivery Method</p>
                  <p className="font-semibold text-gray-800">{job.deliveryMethod.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Job Created</p>
                  <p className="font-semibold text-gray-800">{new Date(job.createdAt).toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 bg-gradient-to-br from-green-50 to-white">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Earning</h2>
              <p className="text-4xl font-bold text-green-600">Rp {job.earning.toLocaleString("id-ID")}</p>
              <p className="text-sm text-gray-500 mt-2">You will receive this amount once the delivery is completed.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">Action Required</h2>
              
              {job.status === 'AVAILABLE' && (
                <div className="space-y-4">
                  <p className="text-gray-600">This job is ready to be picked up. Take it before another driver does!</p>
                  <button
                    onClick={handleTakeJob}
                    disabled={processing}
                    className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg disabled:bg-blue-300 shadow-md"
                  >
                    {processing ? "Processing..." : "Take Job"}
                  </button>
                </div>
              )}

              {job.status === 'TAKEN' && (
                <div className="space-y-4">
                  <p className="text-gray-600">You have taken this job. Once you have delivered the order to the buyer, confirm the completion below.</p>
                  <button
                    onClick={handleCompleteJob}
                    disabled={processing}
                    className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg disabled:bg-green-300 shadow-md"
                  >
                    {processing ? "Processing..." : "Confirm Completed"}
                  </button>
                </div>
              )}

              {job.status === 'COMPLETED' && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Job Completed!</h3>
                  <p className="text-gray-500">You finished this job on {new Date(job.completedAt!).toLocaleString("id-ID")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
