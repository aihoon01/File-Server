CREATE TABLE users (
    userid serial PRIMARY KEY,
    username text NOT NULL,
    password varchar(50) NOT NULL,
    userROle text,
    email VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE files (
    fileid serial PRIMARY KEY,
    title text NOT NULL,
    description text,
    fileName text,
    createdby int REFERENCES users(userId)
);

CREATE TABLE emails (
    emailid serial PRIMARY KEY,
    emailfile int REFERENCES files(fileid),
    FOREIGN KEY(emailid) REFERENCES users(userId)
);

CREATE TABLE downloads (
    downloadid serial PRIMARY KEY,
    downloadfile int REFERENCES files(fileid) NOT NULL
);
