-- Active: 1673871648594@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, email, password, role)
VALUES ("u001", "João", "joaozin@gmail.com", "joao123", "user"),
       ("u002", "Giovana", "giovana@gmail.com", "gih2023", "admin"),
       ("u003", "Ana", "ana@outlook.com", "ana10", "user");


SELECT * FROM users;

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO posts(id, creator_id, content, likes, dislikes)
VALUES("p001", "u002", "CURSO GRÁTIS DISPONÍVEL NO NOSSO SITE, ACESSE JÁ!", 0, 0);

SELECT * FROM posts;

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);