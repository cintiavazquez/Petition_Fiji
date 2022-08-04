DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL
);

CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    artist_id   INTEGER NOT NULL UNIQUE REFERENCES artists (id),
    title       VARCHAR(255) NOT NULL,
    year        integer NOT NULL
);

INSERT INTO artists (name) VALUES('Jimi Hendrix');
INSERT INTO artists (name) VALUES('The Beatles');
INSERT INTO artists (name) VALUES('Miles Davis');
INSERT INTO artists (name) VALUES('Nirvana');

INSERT INTO albums (artist_id, title, year) VALUES (1, 'Are You Experienced', 1967);
INSERT INTO albums (artist_id, title, year) VALUES (2, 'Revolver', 1966);
INSERT INTO albums (artist_id, title, year) VALUES (2, 'Abbey Road', 19679);
INSERT INTO albums (artist_id, title, year) VALUES (3, 'Kind Of Blue', 1959);

-- observe the difference between the following two queries:
SELECT albums.title, albums.year, artists.name AS artist_name
FROM albums
JOIN artists
ON albums.artist_id = artists.id;

SELECT albums.title, albums.year, artists.name AS artist_name
FROM albums
FULL JOIN artists
ON albums.artist_id = artists.id;