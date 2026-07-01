import { AdminDashboard } from "@/components/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/admin";
import { getAllChallengesAdmin } from "@/lib/db";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  const challenges = authed ? getAllChallengesAdmin() : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <AdminDashboard
        initialChallenges={challenges}
        isAuthenticated={authed}
      />
    </div>
  );
}
