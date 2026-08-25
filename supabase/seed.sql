-- ScoutFit real-data seed (run AFTER schema.sql)
-- 88 real players with real EA Sports FC 26 ratings (pace, shooting,
-- passing, dribbling, defending, physical, age) plus real current
-- market values in EUR millions (from Transfermarkt data). 12 clubs
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
insert into club_weights (club_id, position, pace_weight, shooting_weight, passing_weight, dribbling_weight, defending_weight, physical_weight, youth_weight)
select id, 'CB', 5, 0, 25, 10, 35, 10, 15 from inserted_clubs where name = 'Arsenal'
union all
select id, 'FB', 15, 5, 25, 20, 20, 0, 15 from inserted_clubs where name = 'Arsenal'
union all
select id, 'DM', 0, 0, 30, 15, 30, 10, 15 from inserted_clubs where name = 'Arsenal'
union all
select id, 'CM', 5, 5, 35, 25, 15, 5, 10 from inserted_clubs where name = 'Arsenal'
union all
select id, 'CAM', 5, 20, 35, 30, 0, 0, 15 from inserted_clubs where name = 'Arsenal'
union all
select id, 'WING', 25, 15, 20, 30, 0, 0, 15 from inserted_clubs where name = 'Arsenal'
union all
select id, 'ST', 15, 35, 15, 20, 0, 5, 10 from inserted_clubs where name = 'Arsenal'
union all
select id, 'CB', 15, 0, 10, 5, 45, 25, 15 from inserted_clubs where name = 'Liverpool'
union all
select id, 'FB', 25, 5, 10, 15, 30, 15, 15 from inserted_clubs where name = 'Liverpool'
union all
select id, 'DM', 10, 0, 15, 10, 40, 25, 15 from inserted_clubs where name = 'Liverpool'
union all
select id, 'CM', 15, 5, 20, 20, 25, 20, 10 from inserted_clubs where name = 'Liverpool'
union all
select id, 'CAM', 15, 20, 20, 25, 10, 10, 15 from inserted_clubs where name = 'Liverpool'
union all
select id, 'WING', 35, 15, 5, 25, 10, 10, 15 from inserted_clubs where name = 'Liverpool'
union all
select id, 'ST', 25, 35, 0, 15, 10, 20, 10 from inserted_clubs where name = 'Liverpool'
union all
select id, 'CB', 0, 0, 30, 15, 35, 10, 15 from inserted_clubs where name = 'Manchester City'
union all
select id, 'FB', 10, 5, 30, 25, 20, 0, 15 from inserted_clubs where name = 'Manchester City'
union all
select id, 'DM', 0, 0, 35, 20, 30, 10, 15 from inserted_clubs where name = 'Manchester City'
union all
select id, 'CM', 0, 5, 40, 30, 15, 5, 10 from inserted_clubs where name = 'Manchester City'
union all
select id, 'CAM', 0, 20, 40, 35, 0, 0, 15 from inserted_clubs where name = 'Manchester City'
union all
select id, 'WING', 20, 15, 25, 35, 0, 0, 15 from inserted_clubs where name = 'Manchester City'
union all
select id, 'ST', 10, 35, 20, 25, 0, 5, 10 from inserted_clubs where name = 'Manchester City'
union all
select id, 'CB', 20, 0, 5, 0, 35, 25, 15 from inserted_clubs where name = 'Manchester United'
union all
select id, 'FB', 30, 5, 5, 10, 20, 15, 15 from inserted_clubs where name = 'Manchester United'
union all
select id, 'DM', 15, 0, 10, 5, 30, 25, 15 from inserted_clubs where name = 'Manchester United'
union all
select id, 'CM', 20, 5, 15, 15, 15, 20, 10 from inserted_clubs where name = 'Manchester United'
union all
select id, 'CAM', 20, 20, 15, 20, 0, 10, 15 from inserted_clubs where name = 'Manchester United'
union all
select id, 'WING', 40, 15, 0, 20, 0, 10, 15 from inserted_clubs where name = 'Manchester United'
union all
select id, 'ST', 30, 35, 0, 10, 0, 20, 10 from inserted_clubs where name = 'Manchester United'
union all
select id, 'CB', 15, 0, 15, 5, 25, 15, 30 from inserted_clubs where name = 'Chelsea'
union all
select id, 'FB', 25, 5, 15, 15, 10, 5, 30 from inserted_clubs where name = 'Chelsea'
union all
select id, 'DM', 10, 0, 20, 10, 20, 15, 30 from inserted_clubs where name = 'Chelsea'
union all
select id, 'CM', 15, 5, 25, 20, 5, 10, 25 from inserted_clubs where name = 'Chelsea'
union all
select id, 'CAM', 15, 20, 25, 25, 0, 0, 30 from inserted_clubs where name = 'Chelsea'
union all
select id, 'WING', 35, 15, 10, 25, 0, 0, 30 from inserted_clubs where name = 'Chelsea'
union all
select id, 'ST', 25, 35, 5, 15, 0, 10, 25 from inserted_clubs where name = 'Chelsea'
union all
select id, 'CB', 0, 0, 30, 15, 35, 10, 15 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'FB', 10, 5, 30, 25, 20, 0, 15 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'DM', 0, 0, 35, 20, 30, 10, 15 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'CM', 0, 5, 40, 30, 15, 5, 10 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'CAM', 0, 20, 40, 35, 0, 0, 15 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'WING', 20, 15, 25, 35, 0, 0, 15 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'ST', 10, 35, 20, 25, 0, 5, 10 from inserted_clubs where name = 'FC Barcelona'
union all
select id, 'CB', 10, 10, 15, 15, 20, 20, 10 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'FB', 20, 15, 15, 25, 5, 10, 10 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'DM', 5, 10, 20, 20, 15, 20, 10 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'CM', 10, 15, 25, 30, 0, 15, 5 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'CAM', 10, 30, 25, 35, 0, 5, 10 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'WING', 30, 25, 10, 35, 0, 5, 10 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'ST', 20, 45, 5, 25, 0, 15, 5 from inserted_clubs where name = 'Real Madrid'
union all
select id, 'CB', 15, 0, 10, 5, 45, 25, 15 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'FB', 25, 5, 10, 15, 30, 15, 15 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'DM', 10, 0, 15, 10, 40, 25, 15 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'CM', 15, 5, 20, 20, 25, 20, 10 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'CAM', 15, 20, 20, 25, 10, 10, 15 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'WING', 35, 15, 5, 25, 10, 10, 15 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'ST', 25, 35, 0, 15, 10, 20, 10 from inserted_clubs where name = 'Bayern Munich'
union all
select id, 'CB', 5, 0, 25, 10, 35, 10, 15 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'FB', 15, 5, 25, 20, 20, 0, 15 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'DM', 0, 0, 30, 15, 30, 10, 15 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'CM', 5, 5, 35, 25, 15, 5, 10 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'CAM', 5, 20, 35, 30, 0, 0, 15 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'WING', 25, 15, 20, 30, 0, 0, 15 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'ST', 15, 35, 15, 20, 0, 5, 10 from inserted_clubs where name = 'Paris Saint-Germain'
union all
select id, 'CB', 5, 0, 15, 5, 50, 30, 15 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'FB', 15, 0, 15, 15, 35, 20, 15 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'DM', 0, 0, 20, 10, 45, 30, 15 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'CM', 5, 0, 25, 20, 30, 25, 10 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'CAM', 5, 10, 25, 25, 15, 15, 15 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'WING', 25, 5, 10, 25, 15, 15, 15 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'ST', 15, 25, 5, 15, 15, 25, 10 from inserted_clubs where name = 'Juventus FC'
union all
select id, 'CB', 20, 0, 5, 0, 35, 25, 15 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'FB', 30, 5, 5, 10, 20, 15, 15 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'DM', 15, 0, 10, 5, 30, 25, 15 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'CM', 20, 5, 15, 15, 15, 20, 10 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'CAM', 20, 20, 15, 20, 0, 10, 15 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'WING', 40, 15, 0, 20, 0, 10, 15 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'ST', 30, 35, 0, 10, 0, 20, 10 from inserted_clubs where name = 'Borussia Dortmund'
union all
select id, 'CB', 5, 0, 15, 5, 50, 30, 15 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'FB', 15, 0, 15, 15, 35, 20, 15 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'DM', 0, 0, 20, 10, 45, 30, 15 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'CM', 5, 0, 25, 20, 30, 25, 10 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'CAM', 5, 10, 25, 25, 15, 15, 15 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'WING', 25, 5, 10, 25, 15, 15, 15 from inserted_clubs where name = 'Inter Milan'
union all
select id, 'ST', 15, 25, 5, 15, 15, 25, 10 from inserted_clubs where name = 'Inter Milan';

-- Players
insert into players (name, club, position, price) values
  ('W. Saliba', 'Arsenal', 'CB', 100),
  ('Virgil van Dijk', 'Liverpool', 'CB', 15),
  ('Joško Gvardiol', 'Manchester City', 'CB', 70),
  ('Rúben Dias', 'Manchester City', 'CB', 55),
  ('Marc Guéhi', 'Crystal Palace', 'CB', 70),
  ('Ezri Konsa', 'Aston Villa', 'CB', 40),
  ('Pau Torres', 'Aston Villa', 'CB', 20),
  ('Marcos Senesi', 'AFC Bournemouth', 'CB', 25),
  ('Nathan Collins', 'Brentford', 'CB', 30),
  ('Ethan Pinnock', 'Brentford', 'CB', 3),
  ('Lewis Dunk', 'Brighton', 'CB', 3.5),
  ('Jan Paul van Hecke', 'Brighton', 'CB', 45),
  ('James Tarkowski', 'Everton', 'CB', 5),
  ('Jarrad Branthwaite', 'Everton', 'CB', 40),
  ('Calvin Bassey', 'Fulham', 'CB', 28),
  ('Joachim Andersen', 'Fulham', 'CB', 20),
  ('Wout Faes', 'Leicester City', 'CB', 10),
  ('Gabriel Magalhães', 'Arsenal', 'FB', 75),
  ('Trent Alexander-Arnold', 'Real Madrid', 'FB', 60),
  ('Marc Cucurella', 'Chelsea', 'FB', 50),
  ('Milos Kerkez', 'Liverpool', 'FB', 35),
  ('Matty Cash', 'Aston Villa', 'FB', 22),
  ('Lucas Digne', 'Aston Villa', 'FB', 6),
  ('Adam Smith', 'AFC Bournemouth', 'FB', 0.3),
  ('Pervis Estupiñán', 'Inter Milan', 'FB', 12),
  ('Daniel Muñoz', 'Crystal Palace', 'FB', 22),
  ('Tyrick Mitchell', 'Crystal Palace', 'FB', 25),
  ('Vitalii Mykolenko', 'Everton', 'FB', 25),
  ('Antonee Robinson', 'Fulham', 'FB', 22),
  ('James Justin', 'Leeds United', 'FB', 12),
  ('Victor Kristiansen', 'Leicester City', 'FB', 9),
  ('Keane Lewis-Potter', 'Brentford', 'FB', 25),
  ('Adam Wharton', 'Crystal Palace', 'DM', 70),
  ('Idrissa Gueye', 'Everton', 'DM', 0.5),
  ('Moisés Caicedo', 'Chelsea', 'DM', 100),
  ('Ryan Gravenberch', 'Liverpool', 'DM', 80),
  ('Carlos Baleba', 'Brighton', 'DM', 55),
  ('Amadou Onana', 'Aston Villa', 'DM', 45),
  ('Boubacar Kamara', 'Aston Villa', 'DM', 40),
  ('James Garner', 'Everton', 'DM', 45),
  ('Alexis Mac Allister', 'Liverpool', 'CM', 70),
  ('Youri Tielemans', 'Aston Villa', 'CM', 30),
  ('John McGinn', 'Aston Villa', 'CM', 13),
  ('Ryan Christie', 'AFC Bournemouth', 'CM', 8),
  ('Lewis Cook', 'AFC Bournemouth', 'CM', 11),
  ('Cole Palmer', 'Chelsea', 'CAM', 100),
  ('Bruno Fernandes', 'Manchester United', 'CAM', 35),
  ('Martin Ødegaard', 'Arsenal', 'CAM', 65),
  ('Kevin De Bruyne', 'SSC Napoli', 'CAM', 8),
  ('Phil Foden', 'Manchester City', 'CAM', 70),
  ('Dominik Szoboszlai', 'Liverpool', 'CAM', 100),
  ('Morgan Rogers', 'Aston Villa', 'CAM', 90),
  ('Justin Kluivert', 'AFC Bournemouth', 'CAM', 25),
  ('Eberechi Eze', 'Arsenal', 'CAM', 65),
  ('Abdoulaye Doucouré', 'Neom', 'CAM', 5),
  ('Emile Smith Rowe', 'Fulham', 'CAM', 20),
  ('Bilal El Khannouss', 'VfB Stuttgart', 'CAM', 35),
  ('Mohamed Salah', 'Liverpool', 'WING', 22),
  ('Bukayo Saka', 'Arsenal', 'WING', 110),
  ('Antoine Semenyo', 'AFC Bournemouth', 'WING', 80),
  ('Dango Ouattara', 'Brentford', 'WING', 35),
  ('Bryan Mbeumo', 'Manchester United', 'WING', 75),
  ('Kevin Schade', 'Brentford', 'WING', 35),
  ('Kaoru Mitoma', 'Brighton', 'WING', 22),
  ('Yankuba Minteh', 'Brighton', 'WING', 45),
  ('Ismaïla Sarr', 'Crystal Palace', 'WING', 40),
  ('Jack Harrison', 'Leeds United', 'WING', 6.5),
  ('Dwight McNeil', 'Everton', 'WING', 18),
  ('Alex Iwobi', 'Fulham', 'WING', 20),
  ('Adama Traoré', 'Fulham', 'WING', 6),
  ('Stephy Mavididi', 'Leicester City', 'WING', 8),
  ('Iliman Ndiaye', 'Everton', 'WING', 55),
  ('Georginio Rutter', 'Brighton', 'ST', 30),
  ('Erling Haaland', 'Manchester City', 'ST', 200),
  ('Ollie Watkins', 'Aston Villa', 'ST', 25),
  ('Kai Havertz', 'Arsenal', 'ST', 55),
  ('Nicolas Jackson', 'FC Bayern München', 'ST', 40),
  ('Yoane Wissa', 'Newcastle Utd', 'ST', 25),
  ('Danny Welbeck', 'Brighton', 'ST', 3),
  ('Jean-Philippe Mateta', 'Crystal Palace', 'ST', 30),
  ('Raúl Jiménez', 'Fulham', 'ST', 3),
  ('Rasmus Højlund', 'SSC Napoli', 'ST', 60),
  ('Jhon Durán', 'Fenerbahçe', 'ST', 15),
  ('Evanilson', 'AFC Bournemouth', 'ST', 35),
  ('João Pedro', 'Chelsea', 'ST', 80),
  ('Dominic Calvert-Lewin', 'Leeds United', 'ST', 22),
  ('Rodrigo Muniz', 'Fulham', 'ST', 20),
  ('Patson Daka', 'Leicester City', 'ST', 0.4);

-- Player ratings (EA Sports FC 26)
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 77, 39, 68, 72, 87, 83, 25 from players where name = 'W. Saliba' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 73, 60, 72, 72, 90, 87, 34 from players where name = 'Virgil van Dijk' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 78, 71, 75, 78, 84, 82, 24 from players where name = 'Joško Gvardiol' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 59, 39, 69, 69, 86, 84, 28 from players where name = 'Rúben Dias' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 69, 39, 69, 73, 83, 78, 25 from players where name = 'Marc Guéhi' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 75, 53, 71, 75, 84, 78, 28 from players where name = 'Ezri Konsa' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 67, 41, 75, 69, 82, 73, 29 from players where name = 'Pau Torres' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 56, 42, 70, 72, 79, 75, 28 from players where name = 'Marcos Senesi' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 62, 31, 58, 63, 80, 81, 24 from players where name = 'Nathan Collins' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 60, 36, 56, 61, 78, 79, 32 from players where name = 'Ethan Pinnock' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 37, 52, 66, 64, 78, 78, 34 from players where name = 'Lewis Dunk' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 67, 46, 72, 70, 80, 78, 25 from players where name = 'Jan Paul van Hecke' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 45, 47, 64, 59, 81, 82, 33 from players where name = 'James Tarkowski' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 71, 39, 58, 60, 80, 78, 23 from players where name = 'Jarrad Branthwaite' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 81, 44, 63, 68, 77, 87, 26 from players where name = 'Calvin Bassey' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 39, 57, 71, 65, 78, 82, 29 from players where name = 'Joachim Andersen' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 52, 39, 54, 60, 73, 75, 27 from players where name = 'Wout Faes' and position = 'CB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 64, 44, 64, 65, 88, 84, 28 from players where name = 'Gabriel Magalhães' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 76, 72, 89, 80, 80, 74, 27 from players where name = 'Trent Alexander-Arnold' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 75, 64, 79, 80, 82, 79, 27 from players where name = 'Marc Cucurella' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 87, 59, 75, 78, 77, 80, 22 from players where name = 'Milos Kerkez' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 75, 66, 71, 75, 75, 76, 28 from players where name = 'Matty Cash' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 69, 68, 79, 76, 77, 74, 32 from players where name = 'Lucas Digne' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 60, 59, 70, 70, 73, 68, 34 from players where name = 'Adam Smith' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 76, 57, 77, 78, 75, 72, 28 from players where name = 'Pervis Estupiñán' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 75, 69, 72, 76, 79, 81, 29 from players where name = 'Daniel Muñoz' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 75, 41, 68, 73, 76, 70, 26 from players where name = 'Tyrick Mitchell' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 74, 55, 71, 71, 77, 71, 26 from players where name = 'Vitalii Mykolenko' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 88, 46, 75, 77, 78, 80, 28 from players where name = 'Antonee Robinson' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 79, 52, 69, 70, 71, 70, 28 from players where name = 'James Justin' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 68, 59, 67, 73, 72, 73, 23 from players where name = 'Victor Kristiansen' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 77, 67, 72, 77, 70, 64, 25 from players where name = 'Keane Lewis-Potter' and position = 'FB';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 62, 62, 81, 77, 75, 69, 22 from players where name = 'Adam Wharton' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 60, 59, 70, 73, 80, 70, 36 from players where name = 'Idrissa Gueye' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 71, 64, 78, 81, 84, 82, 24 from players where name = 'Moisés Caicedo' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 76, 76, 81, 85, 81, 81, 23 from players where name = 'Ryan Gravenberch' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 74, 70, 75, 80, 79, 79, 22 from players where name = 'Carlos Baleba' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 74, 62, 72, 73, 78, 81, 24 from players where name = 'Amadou Onana' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 64, 55, 74, 75, 83, 80, 26 from players where name = 'Boubacar Kamara' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 58, 65, 78, 72, 71, 70, 25 from players where name = 'James Garner' and position = 'DM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 66, 82, 85, 85, 78, 76, 27 from players where name = 'Alexis Mac Allister' and position = 'CM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 54, 79, 85, 80, 75, 72, 28 from players where name = 'Youri Tielemans' and position = 'CM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 69, 77, 78, 80, 77, 83, 31 from players where name = 'John McGinn' and position = 'CM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 69, 70, 77, 78, 74, 76, 31 from players where name = 'Ryan Christie' and position = 'CM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 69, 63, 77, 77, 75, 73, 29 from players where name = 'Lewis Cook' and position = 'CM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 75, 83, 87, 87, 50, 65, 23 from players where name = 'Cole Palmer' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 67, 83, 89, 83, 65, 75, 31 from players where name = 'Bruno Fernandes' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 68, 79, 88, 87, 67, 65, 27 from players where name = 'Martin Ødegaard' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 66, 83, 92, 84, 65, 72, 34 from players where name = 'Kevin De Bruyne' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 81, 81, 82, 89, 57, 57, 25 from players where name = 'Phil Foden' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 79, 82, 84, 82, 67, 76, 25 from players where name = 'Dominik Szoboszlai' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 77, 77, 79, 84, 67, 79, 23 from players where name = 'Morgan Rogers' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 87, 78, 76, 81, 38, 62, 26 from players where name = 'Justin Kluivert' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 74, 80, 81, 87, 50, 68, 27 from players where name = 'Eberechi Eze' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 53, 76, 71, 73, 75, 81, 33 from players where name = 'Abdoulaye Doucouré' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 72, 72, 75, 80, 52, 61, 25 from players where name = 'Emile Smith Rowe' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 76, 64, 76, 82, 38, 56, 21 from players where name = 'Bilal El Khannouss' and position = 'CAM';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 89, 88, 86, 90, 45, 76, 33 from players where name = 'Mohamed Salah' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 84, 82, 85, 88, 60, 73, 24 from players where name = 'Bukayo Saka' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 80, 78, 73, 81, 40, 79, 26 from players where name = 'Antoine Semenyo' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 85, 70, 70, 78, 53, 59, 24 from players where name = 'Dango Ouattara' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 88, 84, 79, 84, 49, 76, 26 from players where name = 'Bryan Mbeumo' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 92, 75, 70, 78, 30, 68, 24 from players where name = 'Kevin Schade' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 87, 73, 76, 86, 57, 64, 28 from players where name = 'Kaoru Mitoma' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 94, 67, 66, 81, 55, 57, 21 from players where name = 'Yankuba Minteh' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 91, 78, 76, 78, 28, 69, 28 from players where name = 'Ismaïla Sarr' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 76, 69, 71, 75, 47, 66, 29 from players where name = 'Jack Harrison' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 67, 76, 79, 79, 55, 68, 26 from players where name = 'Dwight McNeil' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 76, 74, 77, 81, 56, 73, 29 from players where name = 'Alex Iwobi' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 94, 65, 67, 81, 37, 82, 30 from players where name = 'Adama Traoré' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 87, 73, 69, 75, 28, 72, 27 from players where name = 'Stephy Mavididi' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 84, 76, 70, 84, 40, 63, 26 from players where name = 'Iliman Ndiaye' and position = 'WING';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 77, 75, 75, 80, 60, 74, 23 from players where name = 'Georginio Rutter' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 86, 91, 70, 80, 45, 88, 25 from players where name = 'Erling Haaland' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 77, 83, 73, 80, 50, 80, 30 from players where name = 'Ollie Watkins' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 72, 79, 78, 81, 48, 74, 26 from players where name = 'Kai Havertz' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 82, 77, 69, 79, 40, 77, 24 from players where name = 'Nicolas Jackson' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 85, 82, 70, 80, 31, 71, 29 from players where name = 'Yoane Wissa' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 60, 78, 74, 77, 45, 77, 35 from players where name = 'Danny Welbeck' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 75, 84, 70, 77, 41, 81, 28 from players where name = 'Jean-Philippe Mateta' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 57, 79, 74, 75, 46, 79, 34 from players where name = 'Raúl Jiménez' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 85, 76, 58, 72, 33, 79, 23 from players where name = 'Rasmus Højlund' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 81, 81, 63, 75, 32, 80, 22 from players where name = 'Jhon Durán' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 76, 79, 66, 77, 37, 76, 26 from players where name = 'Evanilson' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 78, 78, 72, 81, 37, 70, 24 from players where name = 'João Pedro' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 72, 72, 63, 70, 38, 75, 29 from players where name = 'Dominic Calvert-Lewin' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 68, 74, 59, 71, 42, 76, 24 from players where name = 'Rodrigo Muniz' and position = 'ST';
insert into player_stats (player_id, season, pace, shooting, passing, dribbling, defending, physical, age)
  select id, 'FC26', 86, 71, 58, 74, 26, 67, 27 from players where name = 'Patson Daka' and position = 'ST';
-- Current squads (EA Sports FC 26) — used for the "vs your current squad"
-- comparison. Stats here are pre-normalized against the SAME bounds as
-- the target pool above (see BOUNDS in generate-real-data.cjs), not
-- re-normalized within each tiny per-club-position group, so a fit
-- score here is directly comparable to a target's fit score.
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Gabriel', 'CB', 61, 33, 48, 32, 88, 79, 55, 28 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'William Saliba', 'CB', 91, 20, 67, 68, 82, 71, 82, 25 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Piero Hincapié', 'CB', 100, 25, 52, 68, 65, 64, 91, 24 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Mosquera', 'CB', 84, 38, 29, 0, 29, 21, 100, 21 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Benjamin White', 'FB', 36, 0, 44, 67, 72, 70, 50, 28 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jurriën Timber', 'FB', 57, 23, 32, 80, 67, 80, 83, 24 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Myles Lewis-Skelly', 'FB', 57, 61, 40, 80, 28, 70, 100, 19 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Riccardo Calafiori', 'FB', 43, 81, 28, 67, 39, 65, 92, 23 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Declan Rice', 'DM', 78, 86, 100, 62, 92, 100, 64, 27 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Zubimendi', 'DM', 44, 57, 82, 54, 69, 31, 64, 27 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Christian Nørgaard', 'DM', 0, 48, 36, 0, 62, 77, 29, 32 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Martin Ødegaard', 'CM', 93, 84, 100, 100, 0, 0, 100, 27 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Mikel Merino', 'CM', 60, 84, 38, 38, 100, 73, 50, 29 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Eberechi Eze', 'CAM', 62, 84, 48, 88, 32, 48, 54, 27 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Bukayo Saka', 'WING', 63, 74, 95, 87, 100, 64, 75, 24 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Leandro Trossard', 'WING', 48, 70, 70, 67, 6, 12, 17, 31 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Gabriel Martinelli', 'WING', 85, 52, 45, 53, 56, 60, 75, 24 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Noni Madueke', 'WING', 78, 43, 40, 53, 53, 48, 75, 24 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ethan Nwaneri', 'WING', 56, 22, 40, 20, 69, 0, 100, 19 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Viktor Gyökeres', 'ST', 100, 75, 75, 100, 29, 100, 62, 27 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Kai Havertz', 'ST', 52, 40, 100, 100, 65, 33, 69, 26 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Gabriel Jesus', 'ST', 83, 40, 80, 100, 38, 19, 54, 28 from clubs where name = 'Arsenal';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Virgil van Dijk', 'CB', 82, 73, 86, 68, 100, 100, 0, 34 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ibrahima Konaté', 'CB', 91, 8, 43, 53, 76, 86, 73, 26 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Joe Gomez', 'CB', 84, 0, 76, 63, 35, 0, 55, 28 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Giovanni Leoni', 'CB', 36, 0, 0, 0, 0, 0, 100, 19 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rhys Williams', 'CB', 61, 10, 0, 0, 0, 0, 82, 25 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jeremie Frimpong', 'FB', 100, 68, 40, 100, 11, 0, 75, 25 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Milos Kerkez', 'FB', 96, 58, 44, 87, 39, 80, 100, 22 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Andrew Robertson', 'FB', 50, 65, 64, 80, 50, 55, 17, 32 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Conor Bradley', 'FB', 71, 65, 24, 67, 28, 50, 100, 22 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Calvin Ramsay', 'FB', 57, 16, 0, 0, 0, 0, 100, 22 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ryan Gravenberch', 'DM', 100, 100, 100, 100, 77, 92, 93, 23 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Wataru Endo', 'DM', 0, 62, 9, 38, 62, 31, 21, 33 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Stefan Bajcetic', 'DM', 89, 0, 0, 8, 0, 15, 100, 21 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Alexis Mac Allister', 'CM', 80, 100, 100, 100, 100, 36, 100, 27 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Trey Nyoni', 'CM', 87, 0, 0, 0, 0, 0, 100, 18 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Florian Wirtz', 'CAM', 79, 95, 81, 100, 43, 44, 92, 22 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Dominik Szoboszlai', 'CAM', 76, 95, 62, 56, 78, 80, 69, 25 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Curtis Jones', 'CAM', 62, 53, 24, 56, 92, 80, 69, 25 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Mohamed Salah', 'WING', 81, 100, 100, 100, 53, 76, 0, 33 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Cody Gakpo', 'WING', 59, 74, 70, 53, 59, 68, 58, 26 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Federico Chiesa', 'WING', 74, 65, 45, 53, 50, 44, 42, 28 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rio Ngumoha', 'WING', 85, 0, 0, 0, 22, 0, 100, 17 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Alexander Isak', 'ST', 90, 90, 75, 100, 38, 43, 69, 26 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Hugo Ekitiké', 'ST', 100, 35, 55, 100, 21, 29, 92, 23 from clubs where name = 'Liverpool';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rúben Dias', 'CB', 50, 20, 71, 53, 76, 79, 55, 28 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Nathan Aké', 'CB', 80, 55, 86, 84, 65, 7, 27, 31 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'John Stones', 'CB', 61, 68, 95, 84, 65, 0, 27, 31 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Abdukodir Khusanov', 'CB', 100, 20, 24, 26, 24, 21, 100, 22 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Joško Gvardiol', 'FB', 64, 97, 44, 87, 78, 90, 83, 24 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rayan Aït-Nouri', 'FB', 86, 39, 48, 100, 39, 30, 83, 24 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Matheus Nunes', 'FB', 89, 94, 48, 93, 17, 60, 58, 27 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rico Lewis', 'FB', 57, 42, 40, 93, 17, 0, 100, 21 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Nico O''Reilly', 'FB', 46, 81, 32, 53, 0, 30, 100, 21 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rodri', 'DM', 39, 100, 100, 92, 100, 100, 50, 29 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Nico González', 'DM', 50, 71, 64, 38, 23, 85, 86, 24 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Kalvin Phillips', 'DM', 0, 48, 27, 0, 8, 8, 43, 30 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Tijjani Reijnders', 'CM', 100, 84, 63, 100, 75, 45, 100, 27 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Bernardo Silva', 'CM', 47, 79, 75, 100, 0, 0, 0, 31 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Mateo Kovačić', 'CM', 87, 58, 50, 75, 0, 0, 0, 31 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Phil Foden', 'WING', 52, 70, 80, 93, 91, 0, 67, 25 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Savinho', 'WING', 74, 26, 60, 73, 6, 0, 100, 21 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rayan Cherki', 'WING', 30, 43, 70, 87, 0, 32, 92, 22 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jérémy Doku', 'WING', 89, 26, 30, 80, 13, 44, 83, 23 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Oscar Bobb', 'WING', 44, 0, 25, 13, 16, 0, 92, 22 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Erling Haaland', 'ST', 100, 100, 60, 91, 56, 100, 77, 25 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Omar Marmoush', 'ST', 100, 70, 90, 100, 24, 19, 62, 27 from clubs where name = 'Manchester City';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Matthijs de Ligt', 'CB', 57, 75, 38, 42, 53, 71, 73, 26 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Lisandro Martínez', 'CB', 68, 70, 100, 84, 47, 50, 55, 28 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Harry Maguire', 'CB', 0, 65, 76, 32, 41, 64, 9, 33 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Luke Shaw', 'CB', 73, 65, 100, 84, 35, 0, 36, 30 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Leny Yoro', 'CB', 73, 25, 29, 26, 35, 0, 100, 20 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ayden Heaven', 'CB', 73, 0, 0, 0, 0, 0, 100, 19 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Tyler Fredricson', 'CB', 64, 0, 0, 0, 0, 0, 100, 21 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Noussair Mazraoui', 'FB', 54, 81, 48, 100, 39, 40, 50, 28 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Diogo Dalot', 'FB', 89, 71, 40, 80, 33, 70, 58, 27 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Tyrell Malacia', 'FB', 61, 42, 8, 67, 11, 35, 67, 26 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Patrick Dorgu', 'FB', 93, 58, 20, 60, 0, 45, 100, 21 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Diego León', 'FB', 82, 32, 0, 7, 0, 0, 100, 18 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Casemiro', 'DM', 0, 90, 55, 0, 69, 54, 14, 34 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Manuel Ugarte', 'DM', 22, 48, 18, 31, 46, 46, 86, 24 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Kobbie Mainoo', 'CM', 93, 32, 0, 50, 0, 18, 100, 20 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Bruno Fernandes', 'CAM', 41, 100, 86, 63, 73, 76, 23, 31 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Matheus Cunha', 'CAM', 71, 100, 38, 69, 16, 76, 62, 26 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Amad', 'CAM', 94, 53, 19, 63, 43, 0, 85, 23 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Mason Mount', 'CAM', 41, 63, 38, 31, 65, 20, 54, 27 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Bryan Mbeumo', 'WING', 78, 83, 65, 60, 66, 76, 58, 26 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Benjamin Šeško', 'ST', 90, 45, 35, 73, 59, 62, 100, 22 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Joshua Zirkzee', 'ST', 48, 25, 70, 100, 44, 43, 85, 24 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Chido Obi', 'ST', 48, 0, 0, 0, 6, 0, 100, 18 from clubs where name = 'Manchester United';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Levi Colwill', 'CB', 75, 30, 81, 68, 47, 50, 100, 23 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Trevoh Chalobah', 'CB', 66, 55, 71, 58, 41, 36, 73, 26 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Wesley Fofana', 'CB', 84, 25, 38, 63, 41, 36, 82, 25 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Tosin Adarabioyo', 'CB', 75, 38, 43, 26, 29, 43, 55, 28 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Axel Disasi', 'CB', 43, 43, 29, 0, 24, 43, 55, 28 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Benoît Badiashile', 'CB', 52, 35, 48, 16, 18, 29, 82, 25 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Marc Cucurella', 'FB', 54, 74, 60, 100, 67, 75, 58, 27 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Reece James', 'FB', 57, 97, 72, 80, 61, 85, 67, 26 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Malo Gusto', 'FB', 86, 13, 44, 87, 17, 50, 100, 22 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jorrel Hato', 'FB', 89, 0, 24, 60, 28, 45, 100, 20 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Josh Acheampong', 'FB', 57, 29, 4, 27, 0, 45, 100, 19 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Moisés Caicedo', 'DM', 72, 43, 73, 69, 100, 100, 86, 24 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Romeo Lavia', 'DM', 61, 0, 18, 38, 46, 46, 100, 22 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Dário Essugo', 'DM', 100, 14, 0, 8, 23, 92, 100, 21 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Enzo Fernández', 'CM', 93, 63, 100, 50, 0, 27, 100, 25 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Andrey Santos', 'CM', 100, 32, 0, 13, 75, 73, 100, 21 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Cole Palmer', 'CAM', 65, 100, 76, 88, 32, 36, 85, 23 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Alejandro Garnacho', 'CAM', 97, 68, 5, 44, 0, 8, 100, 21 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Pedro Neto', 'WING', 89, 48, 40, 47, 38, 44, 58, 26 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Estêvão', 'WING', 85, 39, 35, 47, 16, 0, 100, 18 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Raheem Sterling', 'WING', 56, 39, 40, 47, 44, 0, 17, 31 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jamie Gittens', 'WING', 93, 35, 0, 60, 0, 8, 100, 21 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Facundo Buonanotte', 'WING', 30, 22, 35, 7, 6, 0, 100, 21 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Tyrique George', 'WING', 44, 4, 0, 0, 25, 0, 100, 20 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'João Pedro', 'ST', 72, 35, 70, 100, 32, 14, 85, 24 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Liam Delap', 'ST', 76, 45, 10, 55, 12, 67, 92, 23 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Marc Guiu', 'ST', 66, 0, 0, 0, 29, 38, 100, 20 from clubs where name = 'Chelsea';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ronald Araujo', 'CB', 98, 55, 43, 11, 47, 71, 64, 27 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Pau Cubarsí', 'CB', 75, 28, 57, 95, 65, 21, 100, 19 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Andreas Christensen', 'CB', 61, 3, 62, 58, 47, 7, 45, 29 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Eric García', 'CB', 59, 43, 76, 63, 41, 0, 82, 25 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jules Koundé', 'FB', 86, 19, 40, 93, 89, 100, 58, 27 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Balde', 'FB', 100, 29, 44, 93, 44, 15, 100, 22 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Gerard Martín', 'FB', 39, 35, 24, 27, 11, 20, 83, 24 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Marc Casadó', 'DM', 0, 43, 18, 62, 46, 0, 100, 22 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Marc Bernal', 'DM', 17, 0, 9, 15, 0, 0, 100, 18 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Pedri', 'CM', 100, 53, 100, 100, 100, 45, 100, 23 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Frenkie de Jong', 'CM', 100, 42, 100, 100, 100, 45, 75, 28 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Gavi', 'CM', 100, 16, 13, 100, 0, 0, 100, 21 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Dani Olmo', 'CAM', 59, 79, 57, 88, 32, 0, 54, 27 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Fermín', 'CAM', 62, 58, 19, 56, 65, 0, 92, 22 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Raphinha', 'WING', 89, 83, 95, 80, 78, 72, 33, 29 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Lamine Yamal', 'WING', 67, 70, 100, 100, 0, 0, 100, 18 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ferran Torres', 'WING', 59, 70, 65, 53, 22, 44, 58, 26 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Marcus Rashford', 'WING', 74, 74, 55, 33, 16, 24, 42, 28 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Roony Bardghji', 'WING', 22, 13, 0, 0, 0, 0, 100, 20 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Robert Lewandowski', 'ST', 59, 90, 100, 100, 53, 81, 0, 37 from clubs where name = 'FC Barcelona';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Antonio Rüdiger', 'CB', 95, 60, 86, 58, 65, 93, 9, 33 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Éder Militão', 'CB', 100, 48, 71, 63, 71, 64, 55, 28 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'David Alaba', 'CB', 70, 100, 100, 100, 53, 14, 9, 33 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Dean Huijsen', 'CB', 77, 60, 90, 79, 53, 21, 100, 20 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Asencio', 'CB', 84, 15, 5, 63, 29, 21, 100, 23 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Trent Alexander-Arnold', 'FB', 57, 100, 100, 100, 56, 50, 58, 27 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Carvajal', 'FB', 71, 55, 60, 100, 61, 75, 0, 34 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ferland Mendy', 'FB', 89, 74, 40, 67, 44, 100, 33, 30 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Álvaro Carreras', 'FB', 89, 77, 44, 93, 17, 80, 92, 23 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Fran García', 'FB', 100, 29, 24, 87, 11, 35, 67, 26 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Aurélien Tchouaméni', 'DM', 72, 67, 82, 46, 77, 100, 71, 26 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Federico Valverde', 'CM', 100, 100, 88, 88, 100, 100, 100, 27 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Eduardo Camavinga', 'CM', 100, 26, 50, 88, 100, 73, 100, 23 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Dani Ceballos', 'CM', 47, 42, 38, 63, 0, 0, 50, 29 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jude Bellingham', 'CAM', 79, 100, 57, 100, 100, 100, 92, 22 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Franco Mastantuono', 'CAM', 62, 37, 19, 44, 32, 28, 100, 18 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Vini Jr.', 'WING', 100, 83, 75, 100, 3, 48, 67, 25 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rodrygo', 'WING', 78, 65, 65, 80, 9, 28, 67, 25 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Brahim', 'WING', 56, 39, 65, 67, 9, 4, 58, 26 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Arda Güler', 'WING', 11, 52, 85, 53, 75, 0, 100, 21 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Kylian Mbappé', 'ST', 100, 95, 100, 100, 32, 43, 62, 27 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Endrick', 'ST', 100, 30, 20, 73, 12, 5, 100, 19 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Gonzalo', 'ST', 38, 0, 15, 0, 56, 10, 100, 22 from clubs where name = 'Real Madrid';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jonathan Tah', 'CB', 59, 18, 29, 21, 82, 93, 36, 30 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Dayot Upamecano', 'CB', 91, 35, 48, 74, 65, 79, 64, 27 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Kim Min Jae', 'CB', 82, 5, 19, 21, 59, 79, 45, 29 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Hiroki Ito', 'CB', 84, 65, 81, 68, 41, 0, 73, 26 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Josip Stanišić', 'CB', 82, 33, 52, 53, 35, 7, 73, 26 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Alphonso Davies', 'FB', 100, 81, 56, 100, 22, 60, 75, 25 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Konrad Laimer', 'FB', 79, 90, 48, 67, 61, 60, 50, 28 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Raphaël Guerreiro', 'FB', 32, 100, 84, 100, 22, 0, 17, 32 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Sacha Boey', 'FB', 39, 45, 8, 67, 33, 65, 75, 25 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Joshua Kimmich', 'DM', 78, 90, 100, 92, 92, 77, 36, 31 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Aleksandar Pavlović', 'DM', 22, 43, 82, 46, 38, 15, 100, 21 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'David Santos Daiber', 'DM', 17, 0, 0, 0, 0, 0, 100, 19 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Leon Goretzka', 'CM', 100, 79, 38, 38, 100, 91, 0, 31 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Tom Bischof', 'CM', 27, 21, 25, 25, 0, 0, 100, 20 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jamal Musiala', 'CAM', 79, 95, 43, 100, 76, 36, 85, 23 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Lennart Karl', 'CAM', 47, 0, 0, 0, 0, 0, 100, 18 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Michael Olise', 'WING', 41, 65, 90, 80, 69, 36, 75, 24 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Luis Díaz', 'WING', 78, 70, 50, 80, 53, 72, 33, 29 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Serge Gnabry', 'WING', 44, 78, 60, 60, 47, 36, 25, 30 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Harry Kane', 'ST', 24, 100, 100, 100, 65, 71, 23, 32 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Nicolas Jackson', 'ST', 86, 30, 55, 82, 41, 48, 85, 24 from clubs where name = 'Bayern Munich';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Marquinhos', 'CB', 93, 63, 100, 79, 94, 50, 27, 31 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Willian Pacho', 'CB', 98, 8, 38, 16, 76, 93, 91, 24 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Lucas Hernández', 'CB', 77, 57, 86, 58, 53, 29, 36, 30 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Illia Zabarnyi', 'CB', 98, 15, 48, 26, 41, 36, 100, 23 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Lucas Beraldo', 'CB', 66, 18, 57, 47, 35, 14, 100, 22 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Noham Kamara', 'CB', 59, 33, 10, 0, 0, 0, 100, 19 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Achraf Hakimi', 'FB', 100, 100, 72, 100, 67, 75, 58, 27 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Nuno Mendes', 'FB', 100, 77, 48, 100, 56, 65, 92, 23 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Vitinha', 'CM', 100, 89, 100, 100, 25, 0, 100, 26 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'João Neves', 'CM', 100, 32, 38, 88, 100, 100, 100, 21 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Fabián Ruiz', 'CM', 47, 74, 38, 50, 25, 0, 50, 29 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Warren Zaïre-Emery', 'CM', 100, 26, 0, 25, 25, 64, 100, 20 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Senny Mayulu', 'CM', 100, 26, 0, 13, 0, 0, 100, 19 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Khvicha Kvaratskhelia', 'WING', 70, 65, 85, 87, 94, 84, 67, 25 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Désiré Doué', 'WING', 59, 65, 55, 100, 84, 68, 100, 20 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Bradley Barcola', 'WING', 85, 52, 60, 60, 34, 36, 83, 23 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Lee Kang In', 'WING', 19, 43, 70, 47, 69, 28, 67, 25 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ibrahim Mbaye', 'WING', 37, 0, 0, 0, 0, 0, 100, 18 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ousmane Dembélé', 'ST', 100, 85, 100, 100, 71, 10, 54, 28 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Gonçalo Ramos', 'ST', 55, 40, 30, 64, 65, 57, 85, 24 from clubs where name = 'Paris Saint-Germain';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Bremer', 'CB', 100, 48, 19, 37, 76, 50, 45, 29 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Pierre Kalulu', 'CB', 98, 55, 67, 58, 47, 21, 82, 25 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Federico Gatti', 'CB', 89, 28, 0, 32, 47, 50, 64, 27 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Daniele Rugani', 'CB', 0, 23, 0, 5, 29, 0, 27, 31 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Lloyd Kelly', 'CB', 68, 23, 52, 42, 0, 43, 64, 27 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Andrea Cambiaso', 'FB', 64, 94, 52, 93, 28, 30, 67, 26 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'João Mário', 'FB', 86, 71, 28, 80, 0, 15, 67, 26 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Juan David Cabal', 'FB', 43, 0, 20, 0, 22, 25, 75, 25 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jonas Rouhi', 'FB', 14, 6, 0, 0, 0, 0, 100, 22 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Manuel Locatelli', 'DM', 28, 67, 91, 31, 77, 69, 57, 28 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Khéphren Thuram', 'CM', 100, 68, 0, 38, 100, 82, 100, 25 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Weston McKennie', 'CM', 100, 42, 0, 0, 100, 73, 100, 27 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Fabio Miretti', 'CM', 100, 0, 0, 0, 0, 0, 100, 22 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Teun Koopmeiners', 'CAM', 50, 79, 57, 31, 100, 76, 46, 28 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Kenan Yıldız', 'CAM', 91, 74, 14, 63, 0, 40, 100, 20 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Vasilije Adžić', 'CAM', 41, 0, 0, 0, 0, 0, 100, 19 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Filip Kostić', 'WING', 56, 48, 75, 33, 100, 80, 0, 33 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Edon Zhegrova', 'WING', 63, 26, 50, 67, 0, 20, 50, 27 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Francisco Conceição', 'WING', 74, 13, 35, 67, 25, 0, 83, 23 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Loïs Openda', 'ST', 100, 50, 55, 100, 15, 62, 69, 26 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jonathan David', 'ST', 83, 55, 65, 91, 24, 52, 69, 26 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Dušan Vlahović', 'ST', 72, 65, 55, 64, 9, 71, 69, 26 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Arkadiusz Milik', 'ST', 0, 55, 70, 64, 41, 0, 23, 32 from clubs where name = 'Juventus FC';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Nico Schlotterbeck', 'CB', 84, 73, 100, 74, 71, 64, 73, 26 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Emre Can', 'CB', 91, 100, 86, 79, 53, 79, 18, 32 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Waldemar Anton', 'CB', 73, 40, 62, 37, 65, 79, 45, 29 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Niklas Süle', 'CB', 55, 50, 67, 42, 47, 43, 36, 30 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Aaron Anselmino', 'CB', 68, 35, 38, 21, 0, 0, 100, 20 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Filippo Mane', 'CB', 70, 0, 0, 0, 0, 0, 100, 21 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ramy Bensebaini', 'FB', 46, 94, 24, 80, 44, 75, 33, 30 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Julian Ryerson', 'FB', 50, 71, 28, 73, 39, 90, 50, 28 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Daniel Svensson', 'FB', 61, 48, 44, 73, 17, 50, 83, 24 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Yan Couto', 'FB', 64, 65, 52, 100, 0, 0, 92, 23 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Almugera Kabar', 'FB', 61, 0, 0, 0, 0, 30, 100, 19 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Felix Nmecha', 'DM', 100, 90, 27, 69, 69, 100, 79, 25 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Marcel Sabitzer', 'DM', 89, 100, 91, 62, 38, 54, 29, 32 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Pascal Groß', 'DM', 0, 95, 100, 54, 8, 54, 14, 34 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Salih Özcan', 'DM', 67, 19, 0, 8, 31, 77, 57, 28 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Jobe Bellingham', 'CM', 100, 26, 0, 0, 0, 55, 100, 20 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Julian Brandt', 'CAM', 62, 74, 57, 69, 16, 56, 38, 29 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Carney Chukwuemeka', 'CAM', 62, 11, 14, 38, 51, 40, 92, 22 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Karim Adeyemi', 'WING', 100, 48, 30, 47, 25, 48, 75, 24 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Julien Duranville', 'WING', 78, 0, 0, 47, 0, 0, 100, 19 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Cole Campbell', 'WING', 81, 0, 0, 0, 0, 0, 100, 20 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Serhou Guirassy', 'ST', 52, 85, 90, 100, 56, 76, 38, 30 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Maximilian Beier', 'ST', 100, 40, 50, 91, 50, 0, 92, 23 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Fábio Silva', 'ST', 83, 30, 30, 82, 18, 57, 92, 23 from clubs where name = 'Borussia Dortmund';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Fikayo Tomori', 'CB', 100, 23, 29, 42, 53, 36, 55, 28 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Matteo Gabbia', 'CB', 27, 10, 0, 5, 47, 21, 73, 26 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Strahinja Pavlović', 'CB', 75, 30, 0, 26, 12, 71, 91, 24 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Koni De Winter', 'CB', 68, 23, 19, 37, 12, 0, 100, 23 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'David Odogu', 'CB', 68, 3, 0, 0, 0, 0, 100, 19 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Pervis Estupiñán', 'FB', 57, 52, 52, 87, 28, 40, 50, 28 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Zachary Athekame', 'FB', 79, 0, 0, 0, 0, 20, 100, 21 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Davide Bartesaghi', 'FB', 0, 6, 0, 0, 0, 5, 100, 20 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Youssouf Fofana', 'DM', 56, 62, 45, 46, 62, 62, 64, 27 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Yacine Adli', 'DM', 67, 67, 91, 46, 15, 0, 79, 25 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Samuele Ricci', 'DM', 83, 24, 45, 54, 15, 23, 86, 24 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ardon Jashari', 'DM', 94, 57, 45, 8, 8, 100, 93, 23 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Luka Modrić', 'CM', 93, 58, 100, 100, 0, 0, 0, 40 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Ruben Loftus-Cheek', 'CM', 100, 68, 25, 38, 50, 73, 25, 30 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Adrien Rabiot', 'CAM', 82, 79, 48, 44, 100, 100, 31, 30 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Christopher Nkunku', 'CAM', 71, 79, 43, 56, 5, 12, 46, 28 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Christian Pulisic', 'WING', 78, 74, 70, 73, 56, 32, 50, 27 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Rafael Leão', 'WING', 96, 57, 70, 73, 0, 72, 58, 26 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Alexis Saelemaekers', 'WING', 48, 9, 45, 40, 100, 24, 58, 26 from clubs where name = 'Inter Milan';
insert into squad_players (club_id, name, position, pace, shooting, passing, dribbling, defending, physical, youth, age)
  select id, 'Santiago Giménez', 'ST', 72, 45, 60, 64, 59, 10, 85, 24 from clubs where name = 'Inter Milan';
