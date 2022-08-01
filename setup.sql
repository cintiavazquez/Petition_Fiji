-- drop existing table
DROP TABLE IF EXISTS signatures;

-- then we create a new table:
CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL CHECK (signature != '')
);