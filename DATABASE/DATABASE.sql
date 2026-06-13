create database DentalClinic;
USE DentalClinic;
CREATE TABLE students (
    PatentId INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100),
    PasswordHash varchar(100),
    Email VARCHAR(100)
);
INSERT INTO students (Username, PasswordHash, Email)
VALUES
('gourav', 'gourav123', 'gourav@gmail.com'),
('rahul', 'rahul123', 'rahul@gmail.com'),
('priya', 'priya123', 'priya@gmail.com'),
('amit', 'amit123', 'amit@gmail.com'),
('neha', 'neha123', 'neha@gmail.com');