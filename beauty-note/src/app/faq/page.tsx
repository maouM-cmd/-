import { getAllFaq, seedIfEmpty } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function FaqPage() {
  seedIfEmpty();
  const faq = getAllFaq();

  return (
    <main className="px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">成分FAQ</h1>
        <p className="mt-2 text-sm text-[#6b6560]">
          お客様によく聞かれる成分の質問と答え。
        </p>
      </header>

      <div className="space-y-4">
        {faq.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-[#eadfd4] bg-white p-4"
          >
            <h2 className="font-bold text-[#2d2a26]">Q. {item.question}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#4a4541]">
              A. {item.answer}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
