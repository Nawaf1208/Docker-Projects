const express = require("express");
const mysql = require("mysql2");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

function connectDatabase(){
    db = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    db.connect((error) => {
        if (error) {
            console.error("Failed to connect:", error);
            console.log("Retrying in 2 seconds...");
            return setTimeout(connectDatabase, 2000);
        }

        console.log("Successfully connected");

        const sqlCreateTable =`
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL
        );
        `;

        db.query(sqlCreateTable, (error) => {
            if (error) {
                return console.error("Failed to create table:", error);
            }

            console.log("Posts table is ready");
        });
    });
}

connectDatabase();

app.get("/", (req, res) => {
    res.send("Hello from Docker Compose Lab!");
});

app.get("/about", (req, res) => {
    res.send("This is Project 9 - Docker Compose Lab");
});

app.get("/posts", (req, res) => {
    const sqlSelect = `
    SELECT * FROM posts;
    `;

    db.query(sqlSelect, (error, results) => {
        if (error) {
            console.error("Failed to select:", error);

            return res.status(500).json({
                error: "Failed to retrieve posts"
            });
        }

        return res.json(results);
    });
});

app.post("/posts", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: "Title and content are required"
        });
    }

    const sqlInsert = `
    INSERT INTO posts (title, content) VALUES (?, ?);
    `;

    db.query(sqlInsert, [title, content], (error, results) => {
        if (error) {
            console.error("Failed to insert:", error);

            return res.status(500).json({
                error: "Failed to create post"
            });
        }
        console.log("Inserted");

        return res.status(201).json({
            message: "Post created successfully!",
            id: results.insertId
        });
    }); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});