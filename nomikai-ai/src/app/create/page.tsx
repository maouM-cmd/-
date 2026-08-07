import { CreateEventForm } from "@/components/CreateEventForm";
import { getLocaleFromCookie } from "@/lib/i18n-server";

export default async function CreatePage() {
  const locale = await getLocaleFromCookie();
  const t = locale === "en"
    ? {
        title: "Create a new event",
        desc: "After creation, you'll get share and organizer links.",
      }
    : {
        title: "新しい飲み会を作る",
        desc: "作成後、参加者に共有するリンクが発行されます。",
      };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{t.desc}</p>
      <div className="mt-6">
        <CreateEventForm locale={locale} />
      </div>
    </div>
  );
}
