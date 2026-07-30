import { AdminDashboard } from "@/components/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/admin";
import {
  getAllChallengesAdmin,
  getAllReports,
  getAllSubmissionsAdmin,
  getPendingChallenges,
} from "@/lib/db";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  const initialData = authed
    ? {
        challenges: getAllChallengesAdmin(),
        pending: getPendingChallenges(),
        reports: getAllReports(),
        submissions: getAllSubmissionsAdmin(),
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <AdminDashboard isAuthenticated={authed} initialData={initialData} />
    </div>
  );
}
