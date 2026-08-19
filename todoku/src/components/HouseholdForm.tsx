import type { Household, HouseholdType, IncomeBand } from "@/lib/types";

type FamilyChoice = "children" | "care" | "both" | "none";

function familyFromHousehold(h: Household): FamilyChoice {
  if (h.children.length > 0 && h.caregiving) return "both";
  if (h.children.length > 0) return "children";
  if (h.caregiving) return "care";
  return "none";
}

function applyFamily(h: Household, choice: FamilyChoice): Household {
  if (choice === "children") {
    return {
      ...h,
      caregiving: false,
      children: h.children.length > 0 ? h.children : [{ age: 4 }],
    };
  }
  if (choice === "care") {
    return { ...h, caregiving: true, children: [] };
  }
  if (choice === "both") {
    return {
      ...h,
      caregiving: true,
      children: h.children.length > 0 ? h.children : [{ age: 8 }],
    };
  }
  return { ...h, caregiving: false, children: [] };
}

const FAMILY_OPTIONS: { value: FamilyChoice; label: string; hint: string }[] = [
  { value: "children", label: "子どもがいる", hint: "手当・保育・医療" },
  { value: "care", label: "家族を介護している", hint: "相談・在宅サービス" },
  { value: "both", label: "両方", hint: "子育てと介護" },
  { value: "none", label: "どちらもいない", hint: "住まい・家計" },
];

const TYPE_OPTIONS: { value: HouseholdType; label: string }[] = [
  { value: "single_parent", label: "ひとり親" },
  { value: "couple", label: "夫婦・パートナー" },
  { value: "single", label: "単身" },
  { value: "other", label: "その他" },
];

const INCOME_OPTIONS: { value: IncomeBand; label: string }[] = [
  { value: "low", label: "ぎりぎり" },
  { value: "middle", label: "ふつう" },
  { value: "high", label: "余裕あり" },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-teal bg-teal text-white"
          : "border-teal/20 bg-white text-teal hover:border-teal/50"
      }`}
    >
      {children}
    </button>
  );
}

export function HouseholdForm({
  household,
  onChange,
}: {
  household: Household;
  onChange: (next: Household) => void;
}) {
  const family = familyFromHousehold(household);

  return (
    <div className="space-y-5 rounded-2xl border border-teal/10 bg-paper p-5 shadow-sm">
      <div>
        <p className="text-sm font-bold text-teal">1. いまの家族</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FAMILY_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={family === opt.value}
              onClick={() => onChange(applyFamily(household, opt.value))}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-teal">2. 世帯の形</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={household.householdType === opt.value}
              onClick={() => onChange({ ...household, householdType: opt.value })}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-teal">3. 家計の余裕</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INCOME_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={household.incomeBand === opt.value}
              onClick={() => onChange({ ...household, incomeBand: opt.value })}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
