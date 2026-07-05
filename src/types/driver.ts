export interface DriverJob {
  id: number;
  orderId: number;
  storeName: string;
  deliveryMethod: string;
  earning: number;
  status: "AVAILABLE" | "TAKEN" | "COMPLETED";
  createdAt: string;
  takenAt: string | null;
  completedAt: string | null;
}

export interface DriverDashboard {
  totalEarnings: number;
  activeJob: DriverJob | null;
  jobHistory: DriverJob[];
}
