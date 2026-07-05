"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getAvailableJobs } from "@/lib/driverApi";
import { DriverJob } from "@/types/driver";
import Link from "next/link";
import Header from "@/components/Header";

export default function AvailableJobsPage() {
  const [jobs, setJobs] = useState<DriverJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = getAuth()?.token;
        if (!token) return;
        const data = await getAvailableJobs(token);
        setJobs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <Link href="/driver" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800">Available Delivery Jobs</h1>
          <p className="text-gray-500 mt-2">Find and take delivery jobs from sellers.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading available jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            No jobs are currently available. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Job #{job.id}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase">
                      {job.deliveryMethod.replace("_", " ")}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Store:</span> {job.storeName}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Order ID:</span> #{job.orderId}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Ready since:</span> {new Date(job.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Potential Earning</p>
                    <p className="text-xl font-bold text-green-600">Rp {job.earning.toLocaleString("id-ID")}</p>
                  </div>
                  <Link href={`/driver/jobs/${job.id}`} className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
