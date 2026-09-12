export function WhySection() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-hot)]">
          Scope now
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight">
          まずベイ一人に絞る理由
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">
          推し活の特定体験は、汎用ファッション検索より「誰の、どの秒の、何が」が重要です。
          フロントの空気感が良ければ、同じ骨格でメンバー横断・他アーティストへ広げます。
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "コンテキスト固定",
            body: "出演者名をベイに固定し、過去着用傾向やファン特定ログの照合精度を上げやすい。",
          },
          {
            title: "UIを先に検証",
            body: "スクショ工程の置き換えが気持ちよいかを、実AI前にデザインで判断する。",
          },
          {
            title: "拡張の入口",
            body: "モーメント選択・確証度・代替提案の型が決まれば、入力を他タレントへ差し替え可能。",
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
