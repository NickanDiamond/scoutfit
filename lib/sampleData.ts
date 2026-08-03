import { Weights, Player } from "./scoring";

// TEMPORARY sample/fictional data. Replace with a Supabase query once the
// real dataset (FBref + Transfermarkt) is imported — see supabase/schema.sql.

export const POSITIONS = {
  RW: "Right Winger",
  CB: "Center Back",
} as const;

export type PositionKey = keyof typeof POSITIONS;

interface ClubDef {
  name: string;
  weights: Record<PositionKey, Weights>;
}

export const CLUBS: Record<string, ClubDef> = {
  barcelona: {
    name: "Barcelona",
    weights: {
      RW: { passing: 20, progression: 20, retention: 15, dribbling: 15, creation: 15, pressing: 10, defending: 0, age_score: 5 },
      CB: { passing: 20, progression: 10, retention: 10, dribbling: 0, creation: 0, pressing: 15, defending: 35, age_score: 10 },
    },
  },
  mancity: {
    name: "Manchester City",
    weights: {
      RW: { passing: 25, progression: 15, retention: 10, dribbling: 15, creation: 20, pressing: 10, defending: 0, age_score: 5 },
      CB: { passing: 25, progression: 10, retention: 5, dribbling: 0, creation: 0, pressing: 15, defending: 35, age_score: 10 },
    },
  },
  bayern: {
    name: "Bayern Munich",
    weights: {
      RW: { passing: 15, progression: 15, retention: 5, dribbling: 20, creation: 20, pressing: 15, defending: 0, age_score: 10 },
      CB: { passing: 15, progression: 5, retention: 5, dribbling: 0, creation: 0, pressing: 20, defending: 45, age_score: 10 },
    },
  },
};

export const PLAYERS: Record<PositionKey, Player[]> = {
  RW: [
    { name: "L. Ferreira", age: 23, cost: 65, stats: { passing: 82, progression: 88, retention: 75, dribbling: 90, creation: 85, pressing: 55, defending: 20, age_score: 85 } },
    { name: "K. Adebayo", age: 26, cost: 48, stats: { passing: 78, progression: 80, retention: 70, dribbling: 85, creation: 80, pressing: 60, defending: 25, age_score: 70 } },
    { name: "T. Novak", age: 29, cost: 30, stats: { passing: 85, progression: 75, retention: 80, dribbling: 70, creation: 75, pressing: 50, defending: 22, age_score: 55 } },
    { name: "R. Okafor", age: 21, cost: 40, stats: { passing: 70, progression: 85, retention: 65, dribbling: 88, creation: 78, pressing: 58, defending: 18, age_score: 92 } },
    { name: "D. Almeida", age: 24, cost: 55, stats: { passing: 80, progression: 82, retention: 78, dribbling: 80, creation: 82, pressing: 62, defending: 28, age_score: 80 } },
    { name: "M. Haddad", age: 27, cost: 38, stats: { passing: 75, progression: 70, retention: 72, dribbling: 75, creation: 70, pressing: 55, defending: 20, age_score: 65 } },
    { name: "S. Petrov", age: 22, cost: 42, stats: { passing: 73, progression: 78, retention: 68, dribbling: 83, creation: 76, pressing: 60, defending: 24, age_score: 88 } },
    { name: "J. Larsson", age: 25, cost: 52, stats: { passing: 88, progression: 85, retention: 82, dribbling: 78, creation: 88, pressing: 65, defending: 30, age_score: 75 } },
    { name: "A. Diakite", age: 30, cost: 20, stats: { passing: 79, progression: 68, retention: 74, dribbling: 65, creation: 68, pressing: 48, defending: 26, age_score: 45 } },
  ],
  CB: [
    { name: "V. Sorensen", age: 25, cost: 58, stats: { passing: 78, progression: 55, retention: 60, dribbling: 20, creation: 15, pressing: 70, defending: 90, age_score: 75 } },
    { name: "B. Adeyemi", age: 22, cost: 45, stats: { passing: 72, progression: 60, retention: 58, dribbling: 25, creation: 18, pressing: 75, defending: 85, age_score: 88 } },
    { name: "H. Kowalski", age: 29, cost: 35, stats: { passing: 75, progression: 50, retention: 62, dribbling: 18, creation: 12, pressing: 65, defending: 92, age_score: 55 } },
    { name: "F. Nkemdirim", age: 24, cost: 50, stats: { passing: 80, progression: 58, retention: 65, dribbling: 22, creation: 20, pressing: 72, defending: 88, age_score: 80 } },
    { name: "E. Wallin", age: 27, cost: 40, stats: { passing: 70, progression: 48, retention: 55, dribbling: 15, creation: 10, pressing: 68, defending: 80, age_score: 65 } },
    { name: "C. Duarte", age: 23, cost: 48, stats: { passing: 82, progression: 62, retention: 68, dribbling: 28, creation: 22, pressing: 78, defending: 86, age_score: 85 } },
    { name: "P. Vidmar", age: 31, cost: 18, stats: { passing: 74, progression: 45, retention: 58, dribbling: 12, creation: 8, pressing: 60, defending: 89, age_score: 40 } },
    { name: "N. Osei", age: 26, cost: 33, stats: { passing: 68, progression: 50, retention: 52, dribbling: 20, creation: 15, pressing: 70, defending: 82, age_score: 70 } },
    { name: "G. Melchior", age: 21, cost: 42, stats: { passing: 71, progression: 55, retention: 60, dribbling: 24, creation: 16, pressing: 73, defending: 84, age_score: 90 } },
  ],
};
