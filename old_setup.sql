-- Note: the order of the DROP statements is reversed compared to the CREATE TABLE ones, because if we wiped out users first we'dd get an error in CreateTable, because it is referencing users_id?

-- drop existing table
DROP TABLE IF EXISTS signatures;

-- drop existing users table
DROP TABLE IF EXISTS users;

-- create a new users table:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- then we create a new table:
CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users (id),
    signature TEXT NOT NULL CHECK (signature != '')
);


--UNIQUE: ensures that just a row with that field value exists in a table. An error will be thrown in case an INSERT/UPDATE statement would violate that constraint;
--TIMESTAMP DEFAULT CURRENT_TIMESTAMP: it is a field of type TIMESTAMP (holding a time/date information), that defaults to the current moment is no value is passed;
--REFERENCES <tableName> (<fieldName>): links rows between the current table and the given <tableName>, over the given <fieldName> (usually the id). This is sometimes called a foreign key. It enforces some constrainst if you try to pass an id of a non-existing record from the linked table, or if you delete the linked record before deleting the one from the current table.
