import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminDashboard } from "@/components/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/admin";
import {
  getAllChallengesAdmin,
  getAllReports,
  getAllSubmissionsAdmin,
  getPendingChallenges,
} from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("title") };
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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
