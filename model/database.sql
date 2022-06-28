CREATE TABLE users (
    userId serial PRIMARY KEY,
    username text NOT NULL,
    password varchar(50) NOT NULL,
    userROle text,
    email VARCHAR(50) NOT NULL UNIQUE
)

CREATE TABLE files (
    fileId uuid PRIMARY KEY,
    title text NOT NULL,
    description text,
    fileName text,
    createdBy int REFERENCES users(userId)
)

CREATE TABLE emails (
    emailId uuid PRIMARY KEY,
    emailFile int REFERENCES files(fileId)
    FOREIGN KEY(emailId) REFERENCES users(userId)
)

CREATE TABLE downloads (
    downloadId serial PRIMARY KEY,
    downloadFile int REFERENCES files(fileId) NOT NULL
)
