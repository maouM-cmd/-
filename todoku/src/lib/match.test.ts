import assert from "node:assert/strict";
import { test } from "node:test";
import benefitsJson from "../data/benefits.json";
import personasJson from "../data/personas.json";
import { rankBenefits } from "./match.ts";
import type { Benefit, Persona } from "./types.ts";

const benefits = benefitsJson as Benefit[];
const personas = personasJson as Persona[];

function byId(personaId: string) {
  const persona = personas.find((p) => p.id === personaId);
  assert.ok(persona);
  return rankBenefits(persona.household, benefits);
}

function names(results: ReturnType<typeof rankBenefits>["eligible"]) {
  return results.map((r) => r.benefit.id);
}

test("ひとり親には児童育成手当とひとり親医療費が届く", () => {
  const ranked = byId("hikari");
  const ids = names(ranked.eligible);
  assert.ok(ids.includes("jidouikusei"));
  assert.ok(ids.includes("hitorioya-iryo"));
  assert.ok(ids.includes("jidoufujo"));
  assert.ok(!ids.includes("kyotaku-kaigo"));
  const top = ranked.eligible[0];
  assert.ok(top.score >= 80);
});

test("共働き幼児には保育無償化と応援事業が届き、ひとり親手当は届かない", () => {
  const ranked = byId("sato");
  const ids = names(ranked.eligible);
  assert.ok(ids.includes("hoiku-muryoka"));
  assert.ok(ids.includes("shussan-ouen"));
  assert.ok(ids.includes("babysitter"));
  assert.ok(!ids.includes("jidouikusei"));
  assert.ok(!ids.includes("kyotaku-kaigo"));
});

test("介護世帯には居宅介護が届き、児童手当は届かない", () => {
  const ranked = byId("takahashi");
  const ids = names(ranked.eligible);
  assert.ok(ids.includes("kyotaku-kaigo"));
  assert.ok(ids.includes("kazoku-kaigo"));
  assert.ok(!ids.includes("jidoteate"));
  assert.equal(ranked.totals.count, ranked.eligible.length);
});

test("制度マスタは20件", () => {
  assert.equal(benefits.length, 20);
  assert.equal(personas.length, 3);
});
