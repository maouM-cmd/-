export function WhySection() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-hot)]">
          Scope now
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight">
          物・興味・場所を、同じ骨格で
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">
          推し活の本体は型番検索だけじゃない。発言のハマりや行った店まで含めて
          「推しの今」を見せる。まずはベイ一人で、その可視化の感触を固める。
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "物",
            body: "服・香水・コスメ。確証度付きで買う／似てるを並列する。",
          },
          {
            title: "興味",
            body: "発言から拾ったハマり。出典（秒・引用）なしではカードにしない。",
          },
          {
            title: "場所",
            body: "VLOGや移動ログの店・スポット。地図で開いて聖地巡礼につなぐ。",
          },
        ].map((item) => (
          <div key={item.title} className="border-t border-[var(--line)] pt-5">
            <h3 className="font-display text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
