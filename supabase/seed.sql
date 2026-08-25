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
