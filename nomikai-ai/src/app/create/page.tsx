import { CreateEventForm } from "@/components/CreateEventForm";

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">新しい飲み会を作る</h1>
      <p className="mt-2 text-sm text-gray-600">
        作成後、参加者に共有するリンクが発行されます。
      </p>
      <div className="mt-6">
        <CreateEventForm />
      </div>
    </div>
  );
}
