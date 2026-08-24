-- ScoutFit real-data seed (run AFTER schema.sql)
-- 84 real Premier League players (2024-25 performance stats: goals,
-- assists, minutes, creativity, influence, threat — from the public
-- vaastav/Fantasy-Premier-League dataset) plus real current market
-- values in EUR millions (from Transfermarkt data, Aug 2026). 12 clubs
-- across the Premier League, La Liga, Bundesliga, Ligue 1, and Serie A.

with inserted_clubs as (
  insert into clubs (name, league, tactical_style) values
    ('Arsenal', 'Premier League', 'possession'),
    ('Liverpool', 'Premier League', 'press'),
    ('Manchester City', 'Premier League', 'possession_control'),
    ('Manchester United', 'Premier League', 'direct'),
    ('Chelsea', 'Premier League', 'young_dynamic'),
    ('FC Barcelona', 'La Liga', 'possession_control'),
    ('Real Madrid', 'La Liga', 'galactico'),
    ('Bayern Munich', 'Bundesliga', 'press'),
    ('Paris Saint-Germain', 'Ligue 1', 'possession'),
    ('Juventus FC', 'Serie A', 'defensive_control'),
    ('Borussia Dortmund', 'Bundesliga', 'direct'),
    ('Inter Milan', 'Serie A', 'defensive_control')
  returning id, name
)
insert into club_weights (club_id, position, creativity_weight, threat_weight, influence_weight, productivity_weight, reliability_weight)
select id, 'DEF', 25, 0, 35, 10, 30 from inserted_clubs where name = 'Arsenal'
union all
select id, 'MID', 40, 5, 25, 15, 15 from inserted_clubs where name = 'Arsenal'
union all
select id, 'FWD', 20, 25, 20, 25, 10 from inserted_clubs where name = 'Arsenal'
union all
select id, 'DEF', 5, 20, 35, 15, 25 from inserted_clubs where name = 'Liverpool'
union all
select id, 'MID', 20, 25, 25, 20, 10 from inserted_clubs where name = 'Liverpool'
union all
select id, 'FWD', 0, 45, 20, 30, 5 from inserted_clubs where name = 'Liverpool'
union all
select id, 'DEF', 30, 0, 35, 5, 30 from inserted_clubs where name = 'Manchester City'
union all
select id, 'MID', 45, 5, 25, 10, 15 from inserted_clubs where name = 'Manchester City'
union all
select id, 'FWD', 25, 25, 20, 20, 10 from inserted_clubs where name = 'Manchester City'
union all
select id, 'DEF', 5, 20, 30, 20, 25 from inserted_clubs where name = 'Manchester United'
union all
select id, 'MID', 20, 25, 20, 25, 10 from inserted_clubs where name = 'Manchester United'
union all
select id, 'FWD', 0, 45, 15, 35, 5 from inserted_clubs where name = 'Manchester United'
union all
select id, 'DEF', 15, 15, 25, 25, 20 from inserted_clubs where name = 'Chelsea'
union all
select id, 'MID', 30, 20, 15, 30, 5 from inserted_clubs where name = 'Chelsea'
union all
select id, 'FWD', 10, 40, 10, 40, 0 from inserted_clubs where name = 'Chelsea'
union all
select id, 'DEF', 30, 0, 35, 5, 30 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'MID', 45, 5, 25, 10, 15 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'FWD', 25, 25, 20, 20, 10 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'DEF', 5, 20, 40, 15, 20 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'MID', 20, 25, 30, 20, 5 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'FWD', 0, 45, 25, 30, 0 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'DEF', 5, 20, 35, 15, 25 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'MID', 20, 25, 25, 20, 10 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'FWD', 0, 45, 20, 30, 5 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'DEF', 25, 0, 35, 10, 30 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'MID', 40, 5, 25, 15, 15 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'FWD', 20, 25, 20, 25, 10 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'DEF', 15, 0, 40, 5, 40 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'MID', 30, 5, 30, 10, 25 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'FWD', 10, 25, 25, 20, 20 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'DEF', 5, 20, 30, 20, 25 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'MID', 20, 25, 20, 25, 10 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'FWD', 0, 45, 15, 35, 5 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'DEF', 15, 0, 40, 5, 40 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'MID', 30, 5, 30, 10, 25 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'FWD', 10, 25, 25, 20, 20 from inserted_clubs where name = 'Inter Milan';

-- Players
insert into players (name, club, position, price) values
  ('W. Saliba', 'Arsenal', 'DEF', 100),
  ('Gabriel Magalhães', 'Arsenal', 'DEF', 75),
  ('Virgil van Dijk', 'Liverpool', 'DEF', 15),
  ('Trent Alexander-Arnold', 'Liverpool', 'DEF', 60),
  ('Joško Gvardiol', 'Manchester City', 'DEF', 70),
  ('Rúben Dias', 'Manchester City', 'DEF', 55),
  ('Marc Cucurella', 'Chelsea', 'DEF', 50),
  ('Marc Guéhi', 'Crystal Palace', 'DEF', 70),
  ('Milos Kerkez', 'Bournemouth', 'DEF', 35),
  ('Ezri Konsa', 'Aston Villa', 'DEF', 40),
  ('Pau Torres', 'Aston Villa', 'DEF', 20),
  ('Matty Cash', 'Aston Villa', 'DEF', 22),
  ('Lucas Digne', 'Aston Villa', 'DEF', 6),
  ('Adam Smith', 'Bournemouth', 'DEF', 0.3),
  ('Marcos Senesi', 'Bournemouth', 'DEF', 25),
  ('Nathan Collins', 'Brentford', 'DEF', 30),
  ('Ethan Pinnock', 'Brentford', 'DEF', 3),
  ('Lewis Dunk', 'Brighton', 'DEF', 3.5),
  ('Pervis Estupiñán', 'Brighton', 'DEF', 12),
  ('Jan Paul van Hecke', 'Brighton', 'DEF', 45),
  ('Daniel Muñoz', 'Crystal Palace', 'DEF', 22),
  ('Tyrick Mitchell', 'Crystal Palace', 'DEF', 25),
  ('James Tarkowski', 'Everton', 'DEF', 5),
  ('Vitalii Mykolenko', 'Everton', 'DEF', 25),
  ('Jarrad Branthwaite', 'Everton', 'DEF', 40),
  ('Calvin Bassey', 'Fulham', 'DEF', 28),
  ('Antonee Robinson', 'Fulham', 'DEF', 22),
  ('Joachim Andersen', 'Fulham', 'DEF', 20),
  ('Wout Faes', 'Leicester', 'DEF', 10),
  ('James Justin', 'Leicester', 'DEF', 12),
  ('Victor Kristiansen', 'Leicester', 'DEF', 9),
  ('Mohamed Salah', 'Liverpool', 'MID', 22),
  ('Cole Palmer', 'Chelsea', 'MID', 100),
  ('Bruno Fernandes', 'Manchester United', 'MID', 35),
  ('Bukayo Saka', 'Arsenal', 'MID', 110),
  ('Martin Ødegaard', 'Arsenal', 'MID', 65),
  ('Kevin De Bruyne', 'Manchester City', 'MID', 8),
  ('Phil Foden', 'Manchester City', 'MID', 70),
  ('Alexis Mac Allister', 'Liverpool', 'MID', 70),
  ('Dominik Szoboszlai', 'Liverpool', 'MID', 100),
  ('Youri Tielemans', 'Aston Villa', 'MID', 30),
  ('John McGinn', 'Aston Villa', 'MID', 13),
  ('Morgan Rogers', 'Aston Villa', 'MID', 90),
  ('Justin Kluivert', 'Bournemouth', 'MID', 25),
  ('Antoine Semenyo', 'Bournemouth', 'MID', 80),
  ('Ryan Christie', 'Bournemouth', 'MID', 8),
  ('Lewis Cook', 'Bournemouth', 'MID', 11),
  ('Dango Ouattara', 'Bournemouth', 'MID', 35),
  ('Keane Lewis-Potter', 'Brentford', 'MID', 25),
  ('Bryan Mbeumo', 'Brentford', 'MID', 75),
  ('Kevin Schade', 'Brentford', 'MID', 35),
  ('Kaoru Mitoma', 'Brighton', 'MID', 22),
  ('Yankuba Minteh', 'Brighton', 'MID', 45),
  ('Georginio Rutter', 'Brighton', 'MID', 30),
  ('Eberechi Eze', 'Crystal Palace', 'MID', 65),
  ('Ismaïla Sarr', 'Crystal Palace', 'MID', 40),
  ('Adam Wharton', 'Crystal Palace', 'MID', 70),
  ('Abdoulaye Doucouré', 'Everton', 'MID', 5),
  ('Idrissa Gueye', 'Everton', 'MID', 0.5),
  ('Jack Harrison', 'Everton', 'MID', 6.5),
  ('Dwight McNeil', 'Everton', 'MID', 18),
  ('Alex Iwobi', 'Fulham', 'MID', 20),
  ('Andreas Pereira', 'Fulham', 'MID', 14),
  ('Emile Smith Rowe', 'Fulham', 'MID', 20),
  ('Adama Traoré', 'Fulham', 'MID', 6),
  ('Stephy Mavididi', 'Leicester', 'MID', 8),
  ('Bilal El Khannouss', 'Leicester', 'MID', 35),
  ('Erling Haaland', 'Manchester City', 'FWD', 200),
  ('Ollie Watkins', 'Aston Villa', 'FWD', 25),
  ('Kai Havertz', 'Arsenal', 'FWD', 55),
  ('Nicolas Jackson', 'Chelsea', 'FWD', 40),
  ('Yoane Wissa', 'Brentford', 'FWD', 25),
  ('Danny Welbeck', 'Brighton', 'FWD', 3),
  ('Jean-Philippe Mateta', 'Crystal Palace', 'FWD', 30),
  ('Raúl Jiménez', 'Fulham', 'FWD', 3),
  ('Rasmus Højlund', 'Manchester United', 'FWD', 60),
  ('Jhon Durán', 'Aston Villa', 'FWD', 15),
  ('Evanilson', 'Bournemouth', 'FWD', 35),
  ('João Pedro', 'Brighton', 'FWD', 80),
  ('Iliman Ndiaye', 'Everton', 'FWD', 55),
  ('Dominic Calvert-Lewin', 'Everton', 'FWD', 22),
  ('Rodrigo Muniz', 'Fulham', 'FWD', 20),
  ('Jamie Vardy', 'Leicester', 'FWD', 1),
  ('Patson Daka', 'Leicester', 'FWD', 0.4);

-- Player stats (2024-2025 season)
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3039, 2, 0, 150.1, 672.6, 116 from players where name = 'W. Saliba' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2363, 3, 2, 208.8, 584.6, 287 from players where name = 'Gabriel Magalhães' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3330, 3, 1, 206.6, 932.6, 299 from players where name = 'Virgil van Dijk' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2362, 3, 7, 833.7, 723.8, 268 from players where name = 'Trent Alexander-Arnold' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3278, 5, 0, 501.7, 847, 497 from players where name = 'Joško Gvardiol' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2269, 0, 0, 173.8, 478.2, 150 from players where name = 'Rúben Dias' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2988, 5, 2, 350.6, 668.6, 358 from players where name = 'Marc Cucurella' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3059, 3, 2, 237.6, 827, 247 from players where name = 'Marc Guéhi' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3336, 2, 6, 642, 694, 238 from players where name = 'Milos Kerkez' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2936, 2, 0, 123.9, 532.8, 166 from players where name = 'Ezri Konsa' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2019, 0, 0, 84.5, 350.6, 102 from players where name = 'Pau Torres' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2069, 1, 1, 181, 359.2, 171 from players where name = 'Matty Cash' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2348, 0, 5, 583.9, 512.6, 112 from players where name = 'Lucas Digne' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1586, 0, 0, 147.2, 181.8, 24 from players where name = 'Adam Smith' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1103, 0, 0, 84.2, 271.6, 39 from players where name = 'Marcos Senesi' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3420, 2, 7, 160.5, 1023.2, 311 from players where name = 'Nathan Collins' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1912, 2, 0, 101.2, 540.2, 193 from players where name = 'Ethan Pinnock' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2081, 0, 1, 115.7, 425.4, 128 from players where name = 'Lewis Dunk' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2399, 1, 1, 530.1, 504.4, 173 from players where name = 'Pervis Estupiñán' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2960, 1, 1, 261.8, 736.6, 182 from players where name = 'Jan Paul van Hecke' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3229, 4, 6, 634.2, 816.6, 524 from players where name = 'Daniel Muñoz' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3090, 0, 6, 559.1, 630.8, 170 from players where name = 'Tyrick Mitchell' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2922, 1, 1, 188.8, 859, 217 from players where name = 'James Tarkowski' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3082, 1, 3, 428.5, 621.4, 100 from players where name = 'Vitalii Mykolenko' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2509, 0, 1, 57.7, 624.6, 130 from players where name = 'Jarrad Branthwaite' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3074, 1, 0, 96.7, 587.2, 157 from players where name = 'Calvin Bassey' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3166, 0, 10, 723.4, 922.2, 206 from players where name = 'Antonee Robinson' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2673, 0, 0, 99, 687.6, 162 from players where name = 'Joachim Andersen' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2812, 1, 0, 68.5, 678, 121 from players where name = 'Wout Faes' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2912, 2, 2, 258.5, 615.2, 202 from players where name = 'James Justin' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2481, 0, 1, 358.6, 519.4, 40 from players where name = 'Victor Kristiansen' and position = 'DEF';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3374, 29, 18, 1199.2, 1577, 1985 from players where name = 'Mohamed Salah' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3193, 15, 10, 1259.2, 1068.2, 1052 from players where name = 'Cole Palmer' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3017, 8, 12, 1407.7, 1017.8, 587 from players where name = 'Bruno Fernandes' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1724, 6, 11, 842.8, 606, 830 from players where name = 'Bukayo Saka' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2321, 3, 9, 968.7, 524.6, 493 from players where name = 'Martin Ødegaard' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1694, 4, 9, 920, 466.6, 411 from players where name = 'Kevin De Bruyne' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1771, 7, 3, 749, 448, 449 from players where name = 'Phil Foden' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2597, 5, 6, 731.3, 653.4, 357 from players where name = 'Alexis Mac Allister' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2485, 6, 10, 794.8, 589.8, 601 from players where name = 'Dominik Szoboszlai' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3025, 3, 7, 963.1, 799.6, 333 from players where name = 'Youri Tielemans' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2217, 1, 4, 500.6, 277.2, 263 from players where name = 'John McGinn' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3115, 8, 11, 722.7, 730.6, 689 from players where name = 'Morgan Rogers' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2339, 12, 6, 654.1, 700, 771 from players where name = 'Justin Kluivert' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3202, 11, 7, 688.9, 792.2, 1204 from players where name = 'Antoine Semenyo' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2114, 2, 3, 576.8, 514, 303 from players where name = 'Ryan Christie' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2976, 1, 4, 727.1, 607, 114 from players where name = 'Lewis Cook' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1998, 7, 4, 496.8, 624.6, 754 from players where name = 'Dango Ouattara' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3092, 1, 5, 462.2, 542, 391 from players where name = 'Keane Lewis-Potter' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3415, 20, 9, 1107.5, 1236.8, 1060 from players where name = 'Bryan Mbeumo' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2281, 11, 4, 312.7, 630.8, 892 from players where name = 'Kevin Schade' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2597, 10, 5, 578, 670.6, 856 from players where name = 'Kaoru Mitoma' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1831, 6, 5, 448.9, 523.8, 615 from players where name = 'Yankuba Minteh' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1651, 5, 6, 281.8, 355.4, 404 from players where name = 'Georginio Rutter' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2588, 8, 8, 849.2, 685, 691 from players where name = 'Eberechi Eze' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2708, 8, 7, 618, 675, 866 from players where name = 'Ismaïla Sarr' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1314, 0, 2, 381.4, 261.2, 69 from players where name = 'Adam Wharton' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2563, 3, 2, 379.4, 352.6, 348 from players where name = 'Abdoulaye Doucouré' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 3063, 0, 3, 327.2, 522, 117 from players where name = 'Idrissa Gueye' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2068, 1, 3, 527.7, 277, 288 from players where name = 'Jack Harrison' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1366, 4, 8, 631.8, 392, 207 from players where name = 'Dwight McNeil' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2981, 9, 6, 922.4, 806.8, 699 from players where name = 'Alex Iwobi' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2004, 2, 6, 868.3, 326.6, 300 from players where name = 'Andreas Pereira' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2036, 6, 3, 422.3, 433.8, 386 from players where name = 'Emile Smith Rowe' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1756, 2, 8, 632.1, 385.4, 426 from players where name = 'Adama Traoré' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1606, 4, 1, 375.3, 339.2, 302 from players where name = 'Stephy Mavididi' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2179, 2, 4, 634.1, 381.6, 191 from players where name = 'Bilal El Khannouss' and position = 'MID';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2736, 22, 3, 359.4, 946, 1511 from players where name = 'Erling Haaland' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2593, 16, 8, 345.2, 766, 1148 from players where name = 'Ollie Watkins' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1872, 9, 3, 269, 467.6, 711 from players where name = 'Kai Havertz' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2220, 10, 6, 368.3, 546.4, 976 from players where name = 'Nicolas Jackson' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2921, 18, 6, 400, 849.4, 1181 from players where name = 'Yoane Wissa' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2109, 10, 5, 331.3, 550.2, 676 from players where name = 'Danny Welbeck' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2642, 14, 2, 405.4, 671.6, 800 from players where name = 'Jean-Philippe Mateta' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2486, 12, 3, 372.2, 612.8, 1018 from players where name = 'Raúl Jiménez' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1998, 4, 1, 254.7, 187, 432 from players where name = 'Rasmus Højlund' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 622, 7, 0, 68.9, 273.8, 334 from players where name = 'Jhon Durán' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2317, 10, 5, 331.9, 456, 966 from players where name = 'Evanilson' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1946, 10, 6, 456, 567, 644 from players where name = 'João Pedro' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2426, 9, 0, 326.4, 598, 493 from players where name = 'Iliman Ndiaye' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 1602, 3, 2, 126.1, 200.2, 573 from players where name = 'Dominic Calvert-Lewin' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 943, 8, 1, 95.3, 352.4, 508 from players where name = 'Rodrigo Muniz' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 2825, 9, 5, 270.8, 490.8, 742 from players where name = 'Jamie Vardy' and position = 'FWD';
insert into player_stats (player_id, season, minutes, goals_scored, assists, creativity, influence, threat)
  select id, '2024-2025', 717, 1, 0, 41.7, 86, 148 from players where name = 'Patson Daka' and position = 'FWD';
