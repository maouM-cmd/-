import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-6xl">404</p>
      <h1 className="mt-4 text-xl font-bold">{t("title")}</h1>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-2 text-white"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
