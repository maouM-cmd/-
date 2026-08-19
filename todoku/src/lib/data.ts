import benefitsJson from "@/data/benefits.json";
import personasJson from "@/data/personas.json";
import type { Benefit, Persona } from "./types";

export const benefits = benefitsJson as Benefit[];
export const personas = personasJson as Persona[];

export function getPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}
