const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Se27071997@1891",   // your MySQL password 
    database: "project_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ MySQL Connected");
});

// ✅ GET ALL TASKS
app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, rows) => {
        if (err) throw err;

        // ✅ Convert date format to YYYY-MM-DD
        const formattedRows = rows.map(r => ({
            ...r,
            start_date: r.start_date?.toISOString().split("T")[0],
            end_date: r.end_date?.toISOString().split("T")[0]
        }));

        res.send(formattedRows);
    });
});

// ✅ ADD NEW TASK
app.post("/tasks", (req, res) => {
    const t = req.body;
    const sql = `INSERT INTO tasks (task, owner, start_date, end_date, status, progress, budget, spent)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        t.task, t.owner, t.start_date, t.end_date,
        t.status, t.progress, t.budget, t.spent
    ], (err, result) => {
        if (err) throw err;
        t.id = result.insertId;
        res.send(t);
    });
});

// ✅ UPDATE TASK
app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const t = req.body;

    const sql = `UPDATE tasks SET task=?, owner=?, start_date=?, end_date=?, 
                 status=?, progress=?, budget=?, spent=? WHERE id=?`;

    db.query(sql, [
        t.task, t.owner, t.start_date, t.end_date,
        t.status, t.progress, t.budget, t.spent, id
    ], (err) => {
        if (err) throw err;
        res.send({ message: "updated" });
    });
});

// ✅ DELETE TASK
app.delete("/tasks/:id", (req, res) => {
    db.query("DELETE FROM tasks WHERE id=?", [req.params.id], err => {
        if (err) throw err;
        res.send({ message: "deleted" });
    });
});

// ✅ TEST API
app.get("/get_data", (req, res) => {
    res.json({ status: "API working fine!" });
});

// ✅ START SERVER (fixed)
const PORT = 4000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`✅ API running on http://${HOST}:${PORT}`);
});