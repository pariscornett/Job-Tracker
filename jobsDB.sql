DROP DATABASE IF EXISTS jobs_DB;

CREATE DATABASE jobs_DB;

USE jobs_DB;

CREATE TABLE applications (
    id INT NOT NULL AUTO_INCREMENT,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    salary INT(255) NULL,
    neighborhood VARCHAR(255) NULL,
    have_you_followed_up BOOLEAN NOT NULL DEFAULT 0,
    has_employer_reached_out BOOLEAN NOT NULL DEFAULT 0,
    notes VARCHAR(255) NULL,
    PRIMARY KEY (id)
);

SELECT * FROM applications;