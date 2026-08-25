// Generates lib/sampleData.ts (offline fallback) AND supabase/seed.sql
// (real data ready to paste into the Supabase SQL editor) from the same
// source-of-truth: real EA Sports FC 26 player ratings (pace, shooting,
// passing, dribbling, defending, physical, age — the same six-stat
// "pentagon" EA uses, plus age) matched by name to real current market
// values (EUR) from Transfermarkt data. 88 real players across 7
// granular real positions (Centre-Back, Fullback, Defensive Midfielder,
// Central Midfielder, Attacking Midfielder, Winger, Striker), sourced
// from Transfermarkt's own sub_position taxonomy.
// NOTE: "False Nine" / Second Striker is intentionally not a bucket —
// zero current Premier League players are tagged that position in the
// real data, so it can't be backed with real stats without faking it.
// NOTE: 2 players from the original pool (Andreas Pereira, Jamie Vardy)
// were dropped — they don't have EA FC 26 ratings, so there's no real
// pentagon data to give them. 88 players remain, all real matches.

const METRICS = ["pace", "shooting", "passing", "dribbling", "defending", "physical", "youth"];
const clip = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const POSITIONS = {
  CB: "Centre-Back",
  FB: "Fullback",
  DM: "Defensive Midfielder",
  CM: "Central Midfielder",
  CAM: "Attacking Midfielder",
  WING: "Winger",
  ST: "Striker",
};

// [name, club, pace, shooting, passing, dribbling, defending, physical, age, cost(€m, real Transfermarkt market value)]
const RAW = {
  CB: [
    ["W. Saliba", "Arsenal", 77, 39, 68, 72, 87, 83, 25, 100.0],
    ["Virgil van Dijk", "Liverpool", 73, 60, 72, 72, 90, 87, 34, 15.0],
    ["Joško Gvardiol", "Manchester City", 78, 71, 75, 78, 84, 82, 24, 70.0],
    ["Rúben Dias", "Manchester City", 59, 39, 69, 69, 86, 84, 28, 55.0],
    ["Marc Guéhi", "Crystal Palace", 69, 39, 69, 73, 83, 78, 25, 70.0],
    ["Ezri Konsa", "Aston Villa", 75, 53, 71, 75, 84, 78, 28, 40.0],
    ["Pau Torres", "Aston Villa", 67, 41, 75, 69, 82, 73, 29, 20.0],
    ["Marcos Senesi", "AFC Bournemouth", 56, 42, 70, 72, 79, 75, 28, 25.0],
    ["Nathan Collins", "Brentford", 62, 31, 58, 63, 80, 81, 24, 30.0],
    ["Ethan Pinnock", "Brentford", 60, 36, 56, 61, 78, 79, 32, 3.0],
    ["Lewis Dunk", "Brighton", 37, 52, 66, 64, 78, 78, 34, 3.5],
    ["Jan Paul van Hecke", "Brighton", 67, 46, 72, 70, 80, 78, 25, 45.0],
    ["James Tarkowski", "Everton", 45, 47, 64, 59, 81, 82, 33, 5.0],
    ["Jarrad Branthwaite", "Everton", 71, 39, 58, 60, 80, 78, 23, 40.0],
    ["Calvin Bassey", "Fulham", 81, 44, 63, 68, 77, 87, 26, 28.0],
    ["Joachim Andersen", "Fulham", 39, 57, 71, 65, 78, 82, 29, 20.0],
    ["Wout Faes", "Leicester City", 52, 39, 54, 60, 73, 75, 27, 10.0],
  ],
  FB: [
    ["Gabriel Magalhães", "Arsenal", 64, 44, 64, 65, 88, 84, 28, 75.0],
    ["Trent Alexander-Arnold", "Real Madrid", 76, 72, 89, 80, 80, 74, 27, 60.0],
    ["Marc Cucurella", "Chelsea", 75, 64, 79, 80, 82, 79, 27, 50.0],
    ["Milos Kerkez", "Liverpool", 87, 59, 75, 78, 77, 80, 22, 35.0],
    ["Matty Cash", "Aston Villa", 75, 66, 71, 75, 75, 76, 28, 22.0],
    ["Lucas Digne", "Aston Villa", 69, 68, 79, 76, 77, 74, 32, 6.0],
    ["Adam Smith", "AFC Bournemouth", 60, 59, 70, 70, 73, 68, 34, 0.3],
    ["Pervis Estupiñán", "Inter Milan", 76, 57, 77, 78, 75, 72, 28, 12.0],
    ["Daniel Muñoz", "Crystal Palace", 75, 69, 72, 76, 79, 81, 29, 22.0],
    ["Tyrick Mitchell", "Crystal Palace", 75, 41, 68, 73, 76, 70, 26, 25.0],
    ["Vitalii Mykolenko", "Everton", 74, 55, 71, 71, 77, 71, 26, 25.0],
    ["Antonee Robinson", "Fulham", 88, 46, 75, 77, 78, 80, 28, 22.0],
    ["James Justin", "Leeds United", 79, 52, 69, 70, 71, 70, 28, 12.0],
    ["Victor Kristiansen", "Leicester City", 68, 59, 67, 73, 72, 73, 23, 9.0],
    ["Keane Lewis-Potter", "Brentford", 77, 67, 72, 77, 70, 64, 25, 25.0],
  ],
  DM: [
    ["Adam Wharton", "Crystal Palace", 62, 62, 81, 77, 75, 69, 22, 70.0],
    ["Idrissa Gueye", "Everton", 60, 59, 70, 73, 80, 70, 36, 0.5],
    ["Moisés Caicedo", "Chelsea", 71, 64, 78, 81, 84, 82, 24, 100.0],
    ["Ryan Gravenberch", "Liverpool", 76, 76, 81, 85, 81, 81, 23, 80.0],
    ["Carlos Baleba", "Brighton", 74, 70, 75, 80, 79, 79, 22, 55.0],
    ["Amadou Onana", "Aston Villa", 74, 62, 72, 73, 78, 81, 24, 45.0],
    ["Boubacar Kamara", "Aston Villa", 64, 55, 74, 75, 83, 80, 26, 40.0],
    ["James Garner", "Everton", 58, 65, 78, 72, 71, 70, 25, 45.0],
  ],
  CM: [
    ["Alexis Mac Allister", "Liverpool", 66, 82, 85, 85, 78, 76, 27, 70.0],
    ["Youri Tielemans", "Aston Villa", 54, 79, 85, 80, 75, 72, 28, 30.0],
    ["John McGinn", "Aston Villa", 69, 77, 78, 80, 77, 83, 31, 13.0],
    ["Ryan Christie", "AFC Bournemouth", 69, 70, 77, 78, 74, 76, 31, 8.0],
    ["Lewis Cook", "AFC Bournemouth", 69, 63, 77, 77, 75, 73, 29, 11.0],
  ],
  CAM: [
    ["Cole Palmer", "Chelsea", 75, 83, 87, 87, 50, 65, 23, 100.0],
    ["Bruno Fernandes", "Manchester United", 67, 83, 89, 83, 65, 75, 31, 35.0],
    ["Martin Ødegaard", "Arsenal", 68, 79, 88, 87, 67, 65, 27, 65.0],
    ["Kevin De Bruyne", "SSC Napoli", 66, 83, 92, 84, 65, 72, 34, 8.0],
    ["Phil Foden", "Manchester City", 81, 81, 82, 89, 57, 57, 25, 70.0],
    ["Dominik Szoboszlai", "Liverpool", 79, 82, 84, 82, 67, 76, 25, 100.0],
    ["Morgan Rogers", "Aston Villa", 77, 77, 79, 84, 67, 79, 23, 90.0],
    ["Justin Kluivert", "AFC Bournemouth", 87, 78, 76, 81, 38, 62, 26, 25.0],
    ["Eberechi Eze", "Arsenal", 74, 80, 81, 87, 50, 68, 27, 65.0],
    ["Abdoulaye Doucouré", "Neom", 53, 76, 71, 73, 75, 81, 33, 5.0],
    ["Emile Smith Rowe", "Fulham", 72, 72, 75, 80, 52, 61, 25, 20.0],
    ["Bilal El Khannouss", "VfB Stuttgart", 76, 64, 76, 82, 38, 56, 21, 35.0],
  ],
  WING: [
    ["Mohamed Salah", "Liverpool", 89, 88, 86, 90, 45, 76, 33, 22.0],
    ["Bukayo Saka", "Arsenal", 84, 82, 85, 88, 60, 73, 24, 110.0],
    ["Antoine Semenyo", "AFC Bournemouth", 80, 78, 73, 81, 40, 79, 26, 80.0],
    ["Dango Ouattara", "Brentford", 85, 70, 70, 78, 53, 59, 24, 35.0],
    ["Bryan Mbeumo", "Manchester United", 88, 84, 79, 84, 49, 76, 26, 75.0],
    ["Kevin Schade", "Brentford", 92, 75, 70, 78, 30, 68, 24, 35.0],
    ["Kaoru Mitoma", "Brighton", 87, 73, 76, 86, 57, 64, 28, 22.0],
    ["Yankuba Minteh", "Brighton", 94, 67, 66, 81, 55, 57, 21, 45.0],
    ["Ismaïla Sarr", "Crystal Palace", 91, 78, 76, 78, 28, 69, 28, 40.0],
    ["Jack Harrison", "Leeds United", 76, 69, 71, 75, 47, 66, 29, 6.5],
    ["Dwight McNeil", "Everton", 67, 76, 79, 79, 55, 68, 26, 18.0],
    ["Alex Iwobi", "Fulham", 76, 74, 77, 81, 56, 73, 29, 20.0],
    ["Adama Traoré", "Fulham", 94, 65, 67, 81, 37, 82, 30, 6.0],
    ["Stephy Mavididi", "Leicester City", 87, 73, 69, 75, 28, 72, 27, 8.0],
    ["Iliman Ndiaye", "Everton", 84, 76, 70, 84, 40, 63, 26, 55.0],
  ],
  ST: [
    ["Georginio Rutter", "Brighton", 77, 75, 75, 80, 60, 74, 23, 30.0],
    ["Erling Haaland", "Manchester City", 86, 91, 70, 80, 45, 88, 25, 200.0],
    ["Ollie Watkins", "Aston Villa", 77, 83, 73, 80, 50, 80, 30, 25.0],
    ["Kai Havertz", "Arsenal", 72, 79, 78, 81, 48, 74, 26, 55.0],
    ["Nicolas Jackson", "FC Bayern München", 82, 77, 69, 79, 40, 77, 24, 40.0],
    ["Yoane Wissa", "Newcastle Utd", 85, 82, 70, 80, 31, 71, 29, 25.0],
    ["Danny Welbeck", "Brighton", 60, 78, 74, 77, 45, 77, 35, 3.0],
    ["Jean-Philippe Mateta", "Crystal Palace", 75, 84, 70, 77, 41, 81, 28, 30.0],
    ["Raúl Jiménez", "Fulham", 57, 79, 74, 75, 46, 79, 34, 3.0],
    ["Rasmus Højlund", "SSC Napoli", 85, 76, 58, 72, 33, 79, 23, 60.0],
    ["Jhon Durán", "Fenerbahçe", 81, 81, 63, 75, 32, 80, 22, 15.0],
    ["Evanilson", "AFC Bournemouth", 76, 79, 66, 77, 37, 76, 26, 35.0],
    ["João Pedro", "Chelsea", 78, 78, 72, 81, 37, 70, 24, 80.0],
    ["Dominic Calvert-Lewin", "Leeds United", 72, 72, 63, 70, 38, 75, 29, 22.0],
    ["Rodrigo Muniz", "Fulham", 68, 74, 59, 71, 42, 76, 24, 20.0],
    ["Patson Daka", "Leicester City", 86, 71, 58, 74, 26, 67, 27, 0.4],
  ],
};

// [name, pace, shooting, passing, dribbling, defending, physical, age] — each club's real current
// squad at this position (EA FC 26), used for the "current squad vs upgrade" comparison.
const RAW_SQUAD = {
  arsenal: {
    CB: [
      ["Gabriel", 64, 44, 64, 65, 88, 84, 28],
      ["William Saliba", 77, 39, 68, 72, 87, 83, 25],
      ["Piero Hincapié", 84, 41, 65, 72, 84, 82, 24],
      ["Mosquera", 74, 46, 60, 56, 78, 76, 21],
    ],
    FB: [
      ["Benjamin White", 70, 35, 75, 75, 83, 78, 28],
      ["Jurriën Timber", 76, 48, 72, 77, 82, 80, 24],
      ["Myles Lewis-Skelly", 76, 60, 74, 77, 75, 78, 19],
      ["Riccardo Calafiori", 72, 66, 71, 75, 77, 77, 23],
    ],
    DM: [
      ["Declan Rice", 72, 73, 84, 80, 83, 83, 27],
      ["Zubimendi", 66, 67, 79, 79, 80, 73, 27],
      ["Christian Nørgaard", 49, 65, 74, 71, 79, 79, 32],
    ],
    CM: [
      ["Martin Ødegaard", 68, 79, 88, 87, 67, 65, 27],
      ["Mikel Merino", 63, 79, 80, 80, 81, 80, 29],
    ],
    CAM: [
      ["Eberechi Eze", 74, 80, 81, 87, 50, 68, 27],
    ],
    WING: [
      ["Bukayo Saka", 84, 82, 85, 88, 60, 73, 24],
      ["Leandro Trossard", 80, 81, 80, 85, 30, 60, 31],
      ["Gabriel Martinelli", 90, 77, 75, 83, 46, 72, 24],
      ["Noni Madueke", 88, 75, 74, 83, 45, 69, 24],
      ["Ethan Nwaneri", 82, 70, 74, 78, 50, 54, 19],
    ],
    ST: [
      ["Viktor Gyökeres", 90, 86, 73, 81, 36, 91, 27],
      ["Kai Havertz", 72, 79, 78, 81, 48, 74, 26],
      ["Gabriel Jesus", 81, 79, 74, 86, 39, 71, 28],
    ],
  },
  liverpool: {
    CB: [
      ["Virgil van Dijk", 73, 60, 72, 72, 90, 87, 34],
      ["Ibrahima Konaté", 77, 34, 63, 69, 86, 85, 26],
      ["Joe Gomez", 74, 29, 70, 71, 79, 73, 28],
      ["Giovanni Leoni", 53, 27, 42, 52, 71, 68, 19],
      ["Rhys Williams", 64, 35, 48, 52, 60, 65, 25],
    ],
    FB: [
      ["Jeremie Frimpong", 94, 62, 74, 84, 72, 63, 25],
      ["Milos Kerkez", 87, 59, 75, 78, 77, 80, 22],
      ["Andrew Robertson", 74, 61, 80, 77, 79, 75, 32],
      ["Conor Bradley", 80, 61, 70, 75, 75, 74, 22],
      ["Calvin Ramsay", 76, 46, 61, 64, 58, 64, 22],
    ],
    DM: [
      ["Ryan Gravenberch", 76, 76, 81, 85, 81, 81, 23],
      ["Wataru Endo", 58, 68, 71, 77, 79, 73, 33],
      ["Stefan Bajcetic", 74, 52, 67, 73, 71, 71, 21],
    ],
    CM: [
      ["Alexis Mac Allister", 66, 82, 85, 85, 78, 76, 27],
      ["Trey Nyoni", 67, 54, 61, 69, 52, 52, 18],
    ],
    CAM: [
      ["Florian Wirtz", 80, 82, 88, 90, 54, 67, 22],
      ["Dominik Szoboszlai", 79, 82, 84, 82, 67, 76, 25],
      ["Curtis Jones", 74, 74, 76, 82, 72, 76, 25],
    ],
    WING: [
      ["Mohamed Salah", 89, 88, 86, 90, 45, 76, 33],
      ["Cody Gakpo", 83, 82, 80, 83, 47, 74, 26],
      ["Federico Chiesa", 87, 80, 75, 83, 44, 68, 28],
      ["Rio Ngumoha", 90, 64, 59, 72, 35, 53, 17],
    ],
    ST: [
      ["Alexander Isak", 83, 89, 73, 85, 39, 76, 26],
      ["Hugo Ekitiké", 86, 78, 69, 85, 33, 73, 23],
    ],
  },
  mancity: {
    CB: [
      ["Rúben Dias", 59, 39, 69, 69, 86, 84, 28],
      ["Nathan Aké", 72, 53, 72, 75, 84, 74, 31],
      ["John Stones", 64, 58, 74, 75, 84, 72, 31],
      ["Abdukodir Khusanov", 85, 39, 59, 64, 77, 76, 22],
    ],
    FB: [
      ["Joško Gvardiol", 78, 71, 75, 78, 84, 82, 24],
      ["Rayan Aït-Nouri", 84, 53, 76, 84, 77, 70, 24],
      ["Matheus Nunes", 85, 70, 76, 79, 73, 76, 27],
      ["Rico Lewis", 76, 54, 74, 79, 73, 58, 21],
      ["Nico O'Reilly", 73, 66, 72, 73, 69, 70, 21],
    ],
    DM: [
      ["Rodri", 65, 80, 86, 84, 86, 85, 29],
      ["Nico González", 67, 70, 77, 77, 74, 80, 24],
      ["Kalvin Phillips", 54, 65, 73, 70, 72, 70, 30],
    ],
    CM: [
      ["Tijjani Reijnders", 79, 79, 82, 85, 77, 77, 27],
      ["Bernardo Silva", 61, 78, 83, 89, 71, 65, 31],
      ["Mateo Kovačić", 67, 74, 81, 83, 73, 72, 31],
    ],
    WING: [
      ["Phil Foden", 81, 81, 82, 89, 57, 57, 25],
      ["Savinho", 87, 71, 78, 86, 30, 53, 21],
      ["Rayan Cherki", 75, 75, 80, 88, 21, 65, 22],
      ["Jérémy Doku", 91, 71, 72, 87, 32, 68, 23],
      ["Oscar Bobb", 79, 65, 71, 77, 33, 41, 22],
    ],
    ST: [
      ["Erling Haaland", 86, 91, 70, 80, 45, 88, 25],
      ["Omar Marmoush", 89, 85, 76, 86, 34, 71, 27],
    ],
  },
  manutd: {
    CB: [
      ["Matthijs de Ligt", 62, 61, 62, 67, 82, 83, 26],
      ["Lisandro Martínez", 67, 59, 75, 75, 81, 80, 28],
      ["Harry Maguire", 35, 57, 70, 65, 80, 82, 33],
      ["Luke Shaw", 69, 57, 78, 75, 79, 72, 30],
      ["Leny Yoro", 69, 41, 60, 64, 79, 73, 20],
      ["Ayden Heaven", 69, 28, 52, 59, 69, 71, 19],
      ["Tyler Fredricson", 65, 29, 48, 56, 65, 68, 21],
    ],
    FB: [
      ["Noussair Mazraoui", 75, 66, 76, 80, 77, 72, 28],
      ["Diogo Dalot", 85, 63, 74, 77, 76, 78, 27],
      ["Tyrell Malacia", 77, 54, 66, 75, 72, 71, 26],
      ["Patrick Dorgu", 86, 59, 69, 74, 69, 73, 21],
      ["Diego León", 83, 51, 56, 66, 59, 62, 18],
    ],
    DM: [
      ["Casemiro", 36, 74, 76, 69, 80, 76, 34],
      ["Manuel Ugarte", 62, 65, 72, 76, 77, 75, 24],
    ],
    CM: [
      ["Kobbie Mainoo", 68, 69, 74, 81, 73, 74, 20],
    ],
    CAM: [
      ["Bruno Fernandes", 67, 83, 89, 83, 65, 75, 31],
      ["Matheus Cunha", 77, 85, 79, 84, 44, 75, 26],
      ["Amad", 85, 74, 75, 83, 54, 52, 23],
      ["Mason Mount", 67, 76, 79, 78, 62, 61, 27],
    ],
    WING: [
      ["Bryan Mbeumo", 88, 84, 79, 84, 49, 76, 26],
    ],
    ST: [
      ["Benjamin Šeško", 83, 80, 65, 78, 46, 80, 22],
      ["Joshua Zirkzee", 71, 76, 72, 82, 41, 76, 24],
      ["Chido Obi", 71, 64, 56, 63, 28, 60, 18],
    ],
  },
  chelsea: {
    CB: [
      ["Levi Colwill", 70, 43, 71, 72, 81, 80, 23],
      ["Trevoh Chalobah", 66, 53, 69, 70, 80, 78, 26],
      ["Wesley Fofana", 74, 41, 62, 71, 80, 78, 25],
      ["Tosin Adarabioyo", 70, 46, 63, 64, 78, 79, 28],
      ["Axel Disasi", 56, 48, 60, 58, 77, 79, 28],
      ["Benoît Badiashile", 60, 45, 64, 62, 76, 77, 25],
    ],
    FB: [
      ["Marc Cucurella", 75, 64, 79, 80, 82, 79, 27],
      ["Reece James", 76, 71, 82, 77, 81, 81, 26],
      ["Malo Gusto", 84, 45, 75, 78, 73, 74, 22],
      ["Jorrel Hato", 85, 41, 70, 74, 75, 73, 20],
      ["Josh Acheampong", 76, 50, 65, 69, 66, 73, 19],
    ],
    DM: [
      ["Moisés Caicedo", 71, 64, 78, 81, 84, 82, 24],
      ["Romeo Lavia", 69, 52, 72, 77, 77, 75, 22],
      ["Dário Essugo", 76, 58, 64, 73, 74, 81, 21],
    ],
    CM: [
      ["Enzo Fernández", 68, 75, 85, 81, 73, 75, 25],
      ["Andrey Santos", 74, 69, 74, 78, 77, 80, 21],
    ],
    CAM: [
      ["Cole Palmer", 75, 83, 87, 87, 50, 65, 23],
      ["Alejandro Garnacho", 86, 77, 72, 80, 37, 58, 21],
    ],
    WING: [
      ["Pedro Neto", 91, 76, 74, 82, 40, 68, 26],
      ["Estêvão", 90, 74, 73, 82, 33, 57, 18],
      ["Raheem Sterling", 82, 74, 74, 82, 42, 48, 31],
      ["Jamie Gittens", 92, 73, 66, 84, 27, 59, 21],
      ["Facundo Buonanotte", 75, 70, 73, 76, 30, 53, 21],
      ["Tyrique George", 79, 66, 66, 73, 36, 55, 20],
    ],
    ST: [
      ["João Pedro", 78, 78, 72, 81, 37, 70, 24],
      ["Liam Delap", 79, 80, 60, 76, 30, 81, 23],
      ["Marc Guiu", 76, 70, 55, 69, 36, 75, 20],
    ],
  },
  barcelona: {
    CB: [
      ["Ronald Araujo", 80, 53, 63, 61, 81, 83, 27],
      ["Pau Cubarsí", 70, 42, 66, 77, 84, 76, 19],
      ["Andreas Christensen", 64, 32, 67, 70, 81, 74, 29],
      ["Eric García", 63, 48, 70, 71, 80, 73, 25],
    ],
    FB: [
      ["Jules Koundé", 84, 47, 74, 79, 86, 84, 27],
      ["Balde", 91, 50, 75, 79, 78, 67, 22],
      ["Gerard Martín", 71, 52, 70, 69, 72, 68, 24],
    ],
    DM: [
      ["Marc Casadó", 57, 64, 72, 80, 77, 62, 22],
      ["Marc Bernal", 61, 53, 71, 74, 70, 63, 18],
    ],
    CM: [
      ["Pedri", 77, 73, 85, 91, 78, 77, 23],
      ["Frenkie de Jong", 82, 71, 85, 87, 78, 77, 28],
      ["Gavi", 76, 66, 78, 85, 68, 70, 21],
    ],
    CAM: [
      ["Dani Olmo", 73, 79, 83, 87, 50, 56, 27],
      ["Fermín", 74, 75, 75, 82, 62, 55, 22],
    ],
    WING: [
      ["Raphinha", 91, 84, 85, 87, 53, 75, 29],
      ["Lamine Yamal", 85, 81, 86, 90, 23, 53, 18],
      ["Ferran Torres", 83, 81, 79, 83, 35, 68, 26],
      ["Marcus Rashford", 87, 82, 77, 80, 33, 63, 28],
      ["Roony Bardghji", 73, 68, 63, 74, 25, 53, 20],
    ],
    ST: [
      ["Robert Lewandowski", 74, 89, 79, 85, 44, 84, 37],
    ],
  },
  realmadrid: {
    CB: [
      ["Antonio Rüdiger", 79, 55, 72, 70, 84, 86, 33],
      ["Éder Militão", 82, 50, 69, 71, 85, 82, 28],
      ["David Alaba", 68, 71, 82, 79, 82, 75, 33],
      ["Dean Huijsen", 71, 55, 73, 74, 82, 76, 20],
      ["Asencio", 74, 37, 55, 71, 78, 76, 23],
    ],
    FB: [
      ["Trent Alexander-Arnold", 76, 72, 89, 80, 80, 74, 27],
      ["Carvajal", 80, 58, 79, 81, 81, 79, 34],
      ["Ferland Mendy", 85, 64, 74, 75, 78, 84, 30],
      ["Álvaro Carreras", 85, 65, 75, 79, 73, 80, 23],
      ["Fran García", 89, 50, 70, 78, 72, 71, 26],
    ],
    DM: [
      ["Aurélien Tchouaméni", 71, 69, 79, 78, 81, 82, 26],
    ],
    CM: [
      ["Federico Valverde", 88, 84, 84, 84, 83, 85, 27],
      ["Eduardo Camavinga", 80, 68, 81, 84, 78, 80, 23],
      ["Dani Ceballos", 61, 71, 80, 82, 72, 67, 29],
    ],
    CAM: [
      ["Jude Bellingham", 80, 86, 83, 90, 78, 85, 22],
      ["Franco Mastantuono", 74, 71, 75, 80, 50, 63, 18],
    ],
    WING: [
      ["Vini Jr.", 95, 84, 81, 91, 29, 69, 25],
      ["Rodrygo", 88, 80, 79, 87, 31, 64, 25],
      ["Brahim", 82, 74, 79, 85, 31, 58, 26],
      ["Arda Güler", 70, 77, 83, 83, 52, 50, 21],
    ],
    ST: [
      ["Kylian Mbappé", 97, 90, 81, 92, 37, 76, 27],
      ["Endrick", 87, 77, 62, 78, 30, 68, 19],
      ["Gonzalo", 68, 69, 61, 68, 45, 69, 22],
    ],
  },
  bayern: {
    CB: [
      ["Jonathan Tah", 63, 38, 60, 63, 87, 86, 30],
      ["Dayot Upamecano", 77, 45, 64, 73, 84, 84, 27],
      ["Kim Min Jae", 73, 33, 58, 63, 83, 84, 29],
      ["Hiroki Ito", 74, 57, 71, 72, 80, 72, 26],
      ["Josip Stanišić", 73, 44, 65, 69, 79, 74, 26],
    ],
    FB: [
      ["Alphonso Davies", 94, 66, 78, 85, 74, 76, 25],
      ["Konrad Laimer", 82, 69, 76, 75, 81, 76, 28],
      ["Raphaël Guerreiro", 69, 78, 85, 88, 74, 54, 32],
      ["Sacha Boey", 71, 55, 66, 75, 76, 77, 25],
    ],
    DM: [
      ["Joshua Kimmich", 72, 74, 89, 84, 83, 79, 31],
      ["Aleksandar Pavlović", 62, 64, 79, 78, 76, 71, 21],
      ["David Santos Daiber", 61, 49, 58, 59, 58, 43, 19],
    ],
    CM: [
      ["Leon Goretzka", 77, 78, 80, 80, 80, 82, 31],
      ["Tom Bischof", 58, 67, 79, 79, 60, 60, 20],
    ],
    CAM: [
      ["Jamal Musiala", 80, 82, 80, 90, 66, 65, 23],
      ["Lennart Karl", 69, 58, 60, 69, 34, 37, 18],
    ],
    WING: [
      ["Michael Olise", 78, 80, 84, 87, 50, 66, 24],
      ["Luis Díaz", 88, 81, 76, 87, 45, 75, 29],
      ["Serge Gnabry", 79, 83, 78, 84, 43, 66, 30],
    ],
    ST: [
      ["Harry Kane", 64, 92, 83, 82, 48, 82, 32],
      ["Nicolas Jackson", 82, 77, 69, 79, 40, 77, 24],
    ],
  },
  psg: {
    CB: [
      ["Marquinhos", 78, 56, 75, 74, 89, 80, 31],
      ["Willian Pacho", 80, 34, 62, 62, 86, 86, 24],
      ["Lucas Hernández", 71, 54, 72, 70, 82, 77, 30],
      ["Illia Zabarnyi", 80, 37, 64, 64, 80, 78, 23],
      ["Lucas Beraldo", 66, 38, 66, 68, 79, 75, 22],
      ["Noham Kamara", 63, 44, 56, 58, 63, 55, 19],
    ],
    FB: [
      ["Achraf Hakimi", 92, 79, 82, 83, 82, 79, 27],
      ["Nuno Mendes", 95, 65, 76, 82, 80, 77, 23],
    ],
    CM: [
      ["Vitinha", 72, 80, 86, 90, 75, 70, 26],
      ["João Neves", 74, 69, 80, 84, 82, 83, 21],
      ["Fabián Ruiz", 61, 77, 80, 81, 75, 72, 29],
      ["Warren Zaïre-Emery", 79, 68, 76, 79, 75, 79, 20],
      ["Senny Mayulu", 75, 68, 73, 78, 57, 55, 19],
    ],
    WING: [
      ["Khvicha Kvaratskhelia", 86, 80, 83, 88, 58, 78, 25],
      ["Désiré Doué", 83, 80, 77, 90, 55, 74, 20],
      ["Bradley Barcola", 90, 77, 78, 84, 39, 66, 23],
      ["Lee Kang In", 72, 75, 80, 82, 50, 64, 25],
      ["Ibrahim Mbaye", 77, 59, 59, 70, 25, 45, 18],
    ],
    ST: [
      ["Ousmane Dembélé", 91, 88, 83, 93, 50, 69, 28],
      ["Gonçalo Ramos", 73, 79, 64, 77, 48, 79, 24],
    ],
  },
  juventus: {
    CB: [
      ["Bremer", 82, 50, 58, 66, 86, 80, 29],
      ["Pierre Kalulu", 80, 53, 68, 70, 81, 76, 25],
      ["Federico Gatti", 76, 42, 53, 65, 81, 80, 27],
      ["Daniele Rugani", 34, 40, 54, 60, 78, 70, 31],
      ["Lloyd Kelly", 67, 40, 65, 67, 73, 79, 27],
    ],
    FB: [
      ["Andrea Cambiaso", 78, 70, 77, 79, 75, 70, 26],
      ["João Mário", 84, 63, 71, 77, 69, 67, 26],
      ["Juan David Cabal", 72, 38, 69, 65, 74, 69, 25],
      ["Jonas Rouhi", 64, 43, 59, 63, 66, 53, 22],
    ],
    DM: [
      ["Manuel Locatelli", 63, 69, 80, 76, 81, 78, 28],
    ],
    CM: [
      ["Khéphren Thuram", 78, 76, 77, 80, 81, 81, 25],
      ["Weston McKennie", 77, 71, 77, 77, 80, 80, 27],
      ["Fabio Miretti", 73, 60, 75, 76, 66, 68, 22],
    ],
    CAM: [
      ["Teun Koopmeiners", 70, 79, 83, 78, 75, 75, 28],
      ["Kenan Yıldız", 84, 78, 74, 83, 35, 66, 20],
      ["Vasilije Adžić", 67, 55, 54, 66, 35, 51, 19],
    ],
    WING: [
      ["Filip Kostić", 82, 76, 81, 80, 70, 77, 33],
      ["Edon Zhegrova", 84, 71, 76, 85, 25, 62, 27],
      ["Francisco Conceição", 87, 68, 73, 85, 36, 50, 23],
    ],
    ST: [
      ["Loïs Openda", 95, 81, 69, 81, 31, 80, 26],
      ["Jonathan David", 81, 82, 71, 80, 34, 78, 26],
      ["Dušan Vlahović", 78, 84, 69, 77, 29, 82, 26],
      ["Arkadiusz Milik", 50, 82, 72, 77, 40, 67, 32],
    ],
  },
  dortmund: {
    CB: [
      ["Nico Schlotterbeck", 74, 60, 75, 73, 85, 82, 26],
      ["Emre Can", 77, 76, 72, 74, 82, 84, 32],
      ["Waldemar Anton", 69, 47, 67, 66, 84, 84, 29],
      ["Niklas Süle", 61, 51, 68, 67, 81, 79, 30],
      ["Aaron Anselmino", 67, 45, 62, 63, 70, 72, 20],
      ["Filippo Mane", 68, 25, 43, 55, 62, 61, 21],
    ],
    FB: [
      ["Ramy Bensebaini", 73, 70, 70, 77, 78, 79, 30],
      ["Julian Ryerson", 74, 63, 71, 76, 77, 82, 28],
      ["Daniel Svensson", 77, 56, 75, 76, 73, 74, 24],
      ["Yan Couto", 78, 61, 77, 83, 69, 61, 23],
      ["Almugera Kabar", 77, 41, 60, 63, 58, 70, 19],
    ],
    DM: [
      ["Felix Nmecha", 82, 74, 73, 81, 80, 86, 25],
      ["Marcel Sabitzer", 74, 80, 80, 80, 76, 76, 32],
      ["Pascal Groß", 48, 75, 84, 79, 72, 76, 34],
      ["Salih Özcan", 70, 59, 68, 73, 75, 79, 28],
    ],
    CM: [
      ["Jobe Bellingham", 70, 68, 71, 74, 72, 78, 20],
    ],
    CAM: [
      ["Julian Brandt", 74, 78, 83, 84, 44, 70, 29],
      ["Carney Chukwuemeka", 74, 66, 74, 79, 57, 66, 22],
    ],
    WING: [
      ["Karim Adeyemi", 96, 76, 72, 82, 36, 69, 24],
      ["Julien Duranville", 88, 61, 63, 82, 26, 49, 19],
      ["Cole Campbell", 89, 57, 59, 71, 26, 42, 20],
    ],
    ST: [
      ["Serhou Guirassy", 72, 88, 76, 83, 45, 83, 30],
      ["Maximilian Beier", 86, 79, 68, 80, 43, 62, 23],
      ["Fábio Silva", 81, 77, 64, 79, 32, 79, 23],
    ],
  },
  intermilan: {
    CB: [
      ["Fikayo Tomori", 81, 40, 60, 67, 82, 78, 28],
      ["Matteo Gabbia", 49, 35, 54, 60, 81, 76, 26],
      ["Strahinja Pavlović", 70, 43, 51, 64, 75, 83, 24],
      ["Koni De Winter", 67, 40, 58, 66, 75, 72, 23],
      ["David Odogu", 67, 32, 45, 52, 65, 67, 19],
    ],
    FB: [
      ["Pervis Estupiñán", 76, 57, 77, 78, 75, 72, 28],
      ["Zachary Athekame", 82, 28, 50, 62, 59, 68, 21],
      ["Davide Bartesaghi", 54, 43, 56, 59, 62, 65, 20],
    ],
    DM: [
      ["Youssouf Fofana", 68, 68, 75, 78, 79, 77, 27],
      ["Yacine Adli", 70, 69, 80, 78, 73, 68, 25],
      ["Samuele Ricci", 73, 60, 75, 79, 73, 72, 24],
      ["Ardon Jashari", 75, 67, 75, 73, 72, 82, 23],
    ],
    CM: [
      ["Luka Modrić", 68, 74, 86, 86, 70, 62, 40],
      ["Ruben Loftus-Cheek", 81, 76, 79, 80, 76, 80, 30],
    ],
    CAM: [
      ["Adrien Rabiot", 81, 79, 81, 80, 77, 84, 30],
      ["Christopher Nkunku", 77, 79, 80, 82, 40, 59, 28],
    ],
    WING: [
      ["Christian Pulisic", 88, 82, 80, 86, 46, 65, 27],
      ["Rafael Leão", 93, 78, 80, 86, 28, 75, 26],
      ["Alexis Saelemaekers", 80, 67, 75, 81, 66, 63, 26],
    ],
    ST: [
      ["Santiago Giménez", 78, 80, 70, 77, 46, 69, 24],
    ],
  },
};

function minMaxNormalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 50);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

const PLAYERS = {};
const BOUNDS = {}; // per-position min/max for each metric, from the TARGET pool only —
                    // reused below to normalize squad players onto the exact same scale,
                    // so a target's fit score is directly, honestly comparable to a squad
                    // member's fit score (not two separately-normalized 0-100s that
                    // happen to share a range).
Object.keys(POSITIONS).forEach((pos) => {
  const rows = RAW[pos];
  const pace = rows.map((r) => r[2]);
  const shooting = rows.map((r) => r[3]);
  const passing = rows.map((r) => r[4]);
  const dribbling = rows.map((r) => r[5]);
  const defending = rows.map((r) => r[6]);
  const physical = rows.map((r) => r[7]);
  // Youth: younger = higher score. Flip age's sign before normalizing so
  // the youngest player in the bucket lands at 100, oldest at 0.
  const youthRaw = rows.map((r) => -r[8]);

  const bounds = (values) => ({ min: Math.min(...values), max: Math.max(...values) });
  BOUNDS[pos] = {
    pace: bounds(pace), shooting: bounds(shooting), passing: bounds(passing),
    dribbling: bounds(dribbling), defending: bounds(defending), physical: bounds(physical),
    youth: bounds(youthRaw),
  };

  const n = {
    pace: minMaxNormalize(pace),
    shooting: minMaxNormalize(shooting),
    passing: minMaxNormalize(passing),
    dribbling: minMaxNormalize(dribbling),
    defending: minMaxNormalize(defending),
    physical: minMaxNormalize(physical),
    youth: minMaxNormalize(youthRaw),
  };

  PLAYERS[pos] = rows.map((r, i) => ({
    name: r[0],
    club: r[1],
    cost: r[9],
    raw: { pace: r[2], shooting: r[3], passing: r[4], dribbling: r[5], defending: r[6], physical: r[7], age: r[8] },
    stats: {
      pace: Math.round(n.pace[i]),
      shooting: Math.round(n.shooting[i]),
      passing: Math.round(n.passing[i]),
      dribbling: Math.round(n.dribbling[i]),
      defending: Math.round(n.defending[i]),
      physical: Math.round(n.physical[i]),
      youth: Math.round(n.youth[i]),
    },
  }));
});

function normalizeWithBounds(value, b) {
  if (b.max === b.min) return 50;
  return clip(((value - b.min) / (b.max - b.min)) * 100, 0, 100);
}

// Real current squads (EA FC 26), normalized onto the same 0-100 scale as
// the target pool above (via BOUNDS) so "fit score" is apples-to-apples
// between a player you already have and one you're scouting.
const SQUADS = {};
Object.keys(RAW_SQUAD).forEach((clubKey) => {
  SQUADS[clubKey] = {};
  Object.keys(POSITIONS).forEach((pos) => {
    const rows = RAW_SQUAD[clubKey][pos] || [];
    const b = BOUNDS[pos];
    SQUADS[clubKey][pos] = rows.map((r) => {
      const [name, pace, shooting, passing, dribbling, defending, physical, age] = r;
      return {
        name,
        age,
        stats: {
          pace: Math.round(normalizeWithBounds(pace, b.pace)),
          shooting: Math.round(normalizeWithBounds(shooting, b.shooting)),
          passing: Math.round(normalizeWithBounds(passing, b.passing)),
          dribbling: Math.round(normalizeWithBounds(dribbling, b.dribbling)),
          defending: Math.round(normalizeWithBounds(defending, b.defending)),
          physical: Math.round(normalizeWithBounds(physical, b.physical)),
          youth: Math.round(normalizeWithBounds(-age, b.youth)),
        },
      };
    });
  });
});

const BASE_WEIGHTS = {
  CB:   { pace: 10, shooting: 0,  passing: 15, dribbling: 5,  defending: 35, physical: 20, youth: 15 },
  FB:   { pace: 20, shooting: 5,  passing: 15, dribbling: 15, defending: 20, physical: 10, youth: 15 },
  DM:   { pace: 5,  shooting: 0,  passing: 20, dribbling: 10, defending: 30, physical: 20, youth: 15 },
  CM:   { pace: 10, shooting: 5,  passing: 25, dribbling: 20, defending: 15, physical: 15, youth: 10 },
  CAM:  { pace: 10, shooting: 20, passing: 25, dribbling: 25, defending: 0,  physical: 5,  youth: 15 },
  WING: { pace: 30, shooting: 15, passing: 10, dribbling: 25, defending: 0,  physical: 5,  youth: 15 },
  ST:   { pace: 20, shooting: 35, passing: 5,  dribbling: 15, defending: 0,  physical: 15, youth: 10 },
};
// Each club gets its OWN tactical delta profile (not a shared style
// bucket) so no two clubs ever produce identical weights. Deltas are
// deliberately large (up to +/-22) and touch 4-5 metrics each,
// reflecting each club's real recent tactical reputation, so a club's
// identity visibly reorders recommendations for every position -- not
// just the ones where the default base weight happens to be close.
const CLUB_LIST = [
  { key: "arsenal", name: "Arsenal", league: "Premier League", budgetTier: 130,
    identity: "Structured possession with a real press",
    delta: { passing: 15, dribbling: 10, defending: 8, pace: -8, physical: -10 } },
  { key: "liverpool", name: "Liverpool", league: "Premier League", budgetTier: 140,
    identity: "Fast, vertical, high-intensity press",
    delta: { pace: 15, physical: 12, defending: 10, passing: -10, shooting: -5 } },
  { key: "mancity", name: "Manchester City", league: "Premier League", budgetTier: 180,
    identity: "Total possession control, technical over physical",
    delta: { passing: 22, dribbling: 15, physical: -15, pace: -12, defending: -5 } },
  { key: "manutd", name: "Manchester United", league: "Premier League", budgetTier: 120,
    identity: "Direct, physical, transition-focused",
    delta: { pace: 15, physical: 12, shooting: 8, passing: -15, dribbling: -8 } },
  { key: "chelsea", name: "Chelsea", league: "Premier League", budgetTier: 150,
    identity: "Young, athletic, upside over experience",
    delta: { youth: 20, pace: 10, dribbling: 8, defending: -12, physical: -8 } },
  { key: "barcelona", name: "FC Barcelona", league: "La Liga", budgetTier: 100,
    identity: "Academy possession football, tight budget",
    delta: { passing: 18, dribbling: 15, youth: 12, physical: -15, defending: -10 } },
  { key: "realmadrid", name: "Real Madrid", league: "La Liga", budgetTier: 180,
    identity: "Proven galacticos, clinical over raw potential",
    delta: { shooting: 15, dribbling: 12, youth: -15, physical: 5, defending: -10 } },
  { key: "bayern", name: "Bayern Munich", league: "Bundesliga", budgetTier: 140,
    identity: "Dominant possession with a physical press",
    delta: { passing: 15, defending: 12, physical: 10, pace: 5, youth: -10 } },
  { key: "psg", name: "Paris Saint-Germain", league: "Ligue 1", budgetTier: 170,
    identity: "Individual flair and pace in transition",
    delta: { dribbling: 18, pace: 12, passing: 10, defending: -12, physical: -8 } },
  { key: "juventus", name: "Juventus FC", league: "Serie A", budgetTier: 90,
    identity: "Defensive solidity, experience over risk",
    delta: { defending: 18, physical: 12, youth: -12, pace: -8, shooting: -5 } },
  { key: "dortmund", name: "Borussia Dortmund", league: "Bundesliga", budgetTier: 90,
    identity: "Raw pace and young talent development",
    delta: { pace: 18, youth: 15, dribbling: 10, physical: -8, defending: -8 } },
  { key: "intermilan", name: "Inter Milan", league: "Serie A", budgetTier: 80,
    identity: "Tactically disciplined, physical, experienced spine",
    delta: { defending: 15, physical: 15, youth: -15, pace: -10, dribbling: -5 } },
];
function buildWeights(position, delta) {
  const base = BASE_WEIGHTS[position];
  const w = {};
  METRICS.forEach((m) => { w[m] = Math.round(clip((base[m] || 0) + (delta[m] || 0), 0, 100)); });
  return w;
}
const CLUBS = {};
CLUB_LIST.forEach((c) => {
  CLUBS[c.key] = { name: c.name, weights: Object.fromEntries(Object.keys(POSITIONS).map((pos) => [pos, buildWeights(pos, c.delta)])) };
});

// ---------- lib/sampleData.ts ----------
function tsWeights(w) { return `{ ${METRICS.map((m) => `${m}: ${w[m]}`).join(", ")} }`; }
function tsStats(s) { return `{ ${METRICS.map((m) => `${m}: ${s[m]}`).join(", ")} }`; }

let ts = `import { Weights, Player } from "./scoring";

// Real EA Sports FC 26 player ratings (pace, shooting, passing,
// dribbling, defending, physical, age — matched by name to each real
// player), plus real current market values in €m from Transfermarkt
// data. Used as the offline fallback pool of realistic transfer targets
// when Supabase isn't connected.
// Generated by generate-real-data.cjs — regenerate with
// \`node generate-real-data.cjs\` after editing the RAW stats above.
// This also produces supabase/seed.sql from the same source data.
// See lib/supabaseClient.ts (isSupabaseConfigured) and lib/db.ts.

export const POSITIONS = {
${Object.entries(POSITIONS).map(([k, v]) => `  ${k}: "${v}",`).join("\n")}
} as const;

export type PositionKey = keyof typeof POSITIONS;

interface ClubDef {
  name: string;
  identity: string;
  budgetTier: number;
  weights: Record<PositionKey, Weights>;
}

export const CLUBS: Record<string, ClubDef> = {
`;
CLUB_LIST.forEach((c) => {
  ts += `  ${c.key}: {\n    name: "${c.name}",\n    identity: ${JSON.stringify(c.identity)},\n    budgetTier: ${c.budgetTier},\n    weights: {\n`;
  Object.keys(POSITIONS).forEach((pos) => { ts += `      ${pos}: ${tsWeights(CLUBS[c.key].weights[pos])},\n`; });
  ts += `    },\n  },\n`;
});
ts += `};\n\nexport const PLAYERS: Record<PositionKey, Player[]> = {\n`;
Object.keys(POSITIONS).forEach((pos) => {
  ts += `  ${pos}: [\n`;
  PLAYERS[pos].forEach((p) => { ts += `    { name: "${p.name}", cost: ${p.cost}, stats: ${tsStats(p.stats)} },\n`; });
  ts += `  ],\n`;
});
ts += `};\n\nexport interface SquadMember {\n  name: string;\n  age: number;\n  stats: import("./scoring").PlayerStats;\n}\n\n`;
ts += `// Each club's real current squad (EA FC 26), normalized onto the same\n// scale as PLAYERS above so fit scores are directly comparable — used to\n// show "here's what you already have" next to scouting recommendations.\nexport const SQUADS: Record<string, Partial<Record<PositionKey, SquadMember[]>>> = {\n`;
CLUB_LIST.forEach((c) => {
  ts += `  ${c.key}: {\n`;
  Object.keys(POSITIONS).forEach((pos) => {
    const members = SQUADS[c.key][pos];
    if (!members || members.length === 0) return;
    ts += `    ${pos}: [\n`;
    members.forEach((m) => { ts += `      { name: "${m.name}", age: ${m.age}, stats: ${tsStats(m.stats)} },\n`; });
    ts += `    ],\n`;
  });
  ts += `  },\n`;
});
ts += `};\n`;
require("fs").writeFileSync("lib/sampleData.ts", ts);

// ---------- supabase/seed.sql ----------
function sqlStr(s) { return `'${String(s).replace(/'/g, "''")}'`; }

let sql = `-- ScoutFit real-data seed (run AFTER schema.sql)
-- 88 real players with real EA Sports FC 26 ratings (pace, shooting,
-- passing, dribbling, defending, physical, age) plus real current
-- market values in EUR millions (from Transfermarkt data). 12 clubs
-- across the Premier League, La Liga, Bundesliga, Ligue 1, and Serie A.

with inserted_clubs as (
  insert into clubs (name, league, tactical_style, budget_tier) values
`;
sql += CLUB_LIST.map((c) => `    (${sqlStr(c.name)}, ${sqlStr(c.league)}, ${sqlStr(c.identity)}, ${c.budgetTier})`).join(",\n") + "\n";
sql += `  returning id, name
)
insert into club_weights (club_id, position, pace_weight, shooting_weight, passing_weight, dribbling_weight, defending_weight, physical_weight, youth_weight)
`;
const weightRows = [];
CLUB_LIST.forEach((c) => {
  Object.keys(POSITIONS).forEach((pos) => {
    const w = CLUBS[c.key].weights[pos];
    weightRows.push(`select id, '${pos}', ${w.pace}, ${w.shooting}, ${w.passing}, ${w.dribbling}, ${w.defending}, ${w.physical}, ${w.youth} from inserted_clubs where name = ${sqlStr(c.name)}`);
  });
});
sql += weightRows.join("\nunion all\n") + ";\n\n";

sql += `-- Players\ninsert into players (name, club, position, price) values\n`;
const playerRows = [];
Object.keys(POSITIONS).forEach((pos) => {
  PLAYERS[pos].forEach((p) => {
    playerRows.push(`  (${sqlStr(p.name)}, ${sqlStr(p.club)}, '${pos}', ${p.cost})`);
  });
});
sql += playerRows.join(",\n") + ";\n\n";

sql += `-- Player ratings (EA Sports FC 26)\n`;
Object.keys(POSITIONS).forEach((pos) => {
  PLAYERS[pos].forEach((p) => {
    const r = p.raw;
    sql += `insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)\n`;
    sql += `  select id, 'FC26', ${r.pace}, ${r.shooting}, ${r.passing}, ${r.dribbling}, ${r.defending}, ${r.physical}, ${r.age} from players where name = ${sqlStr(p.name)} and position = '${pos}';\n`;
  });
});

sql += `-- Current squads (EA Sports FC 26) — used for the "vs your current squad"\n-- comparison. Stats here are pre-normalized against the SAME bounds as\n-- the target pool above (see BOUNDS in generate-real-data.cjs), not\n-- re-normalized within each tiny per-club-position group, so a fit\n-- score here is directly comparable to a target's fit score.\n`;
CLUB_LIST.forEach((c) => {
  Object.keys(POSITIONS).forEach((pos) => {
    const members = SQUADS[c.key][pos];
    if (!members || members.length === 0) return;
    members.forEach((m) => {
      sql += `insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)\n`;
      sql += `  select id, ${sqlStr(m.name)}, '${pos}', ${m.stats.pace}, ${m.stats.shooting}, ${m.stats.passing}, ${m.stats.dribbling}, ${m.stats.defending}, ${m.stats.physical}, ${m.stats.youth}, ${m.age} from clubs where name = ${sqlStr(c.name)};\n`;
    });
  });
});

require("fs").writeFileSync("supabase/seed.sql", sql);

const total = Object.values(PLAYERS).reduce((s, a) => s + a.length, 0);
const squadTotal = Object.values(SQUADS).reduce((s, byPos) => s + Object.values(byPos).reduce((s2, arr) => s2 + arr.length, 0), 0);
console.log("wrote lib/sampleData.ts and supabase/seed.sql —", CLUB_LIST.length, "clubs,", Object.keys(POSITIONS).length, "positions,", total, "real target players,", squadTotal, "real current-squad players");
