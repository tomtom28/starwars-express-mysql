CREATE DATABASE starwars;

USE starwars;


-- Make Table
 CREATE TABLE characters(
  ID INTEGER AUTO_INCREMENT PRIMARY KEY,
  RouteName VARCHAR(30),
  CharName VARCHAR(30),
  CharRole VARCHAR(30),
  CharAge INTEGER,
  ForcePoints INTEGER);



-- Add Values to Table
INSERT INTO characters(RouteName, CharName, CharRole, CharAge, ForcePoints)
VALUES ("yoda", "Yoda", "Jedi Master", 900, 2000),
  ("darthmaul", "Darth Maul", "Sith Lord", 200, 1200),
  ("obiwakenobi", "Obi Wan Kenobi", "Jedi Master", 55, 1350);