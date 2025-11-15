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
app.get("/projects", (req, res) => {
    db.query("SELECT * FROM projects", (err, rows) => {
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

// ✅ CREATE NEW PROJECT
app.post("/projects", (req, res) => {
    const t = req.body;
    const sql = `INSERT INTO projects (jobno, enquery_date, project_name, customer, contact_person, quantity, expected_date, designer_name, design_start_date, design_end_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        t.jobno, t.enquery_date, t.project_name, t.customer,t.contact_person, t.quantity, t.expected_date, t.designer_name, t.design_start_date, t.design_end_date
    ], (err, result) => {
        if (err) throw err;
        t.id = result.insertId;
        res.send(t);
    });
});

// ✅ UPDATE TASK
app.put("/projects/:id", (req, res) => {
    const id = req.params.id;
    const t = req.body;

    const sql = `UPDATE projects SET jobno=?,  WHERE id=?`;

    db.query(sql, [
        t.jobno, id
    ], (err) => {
        if (err) throw err;
        res.send({ message: "updated" });
    });
});

// ✅ DELETE TASK
app.delete("/projects/:id", (req, res) => {
    db.query("DELETE FROM projects WHERE id=?", [req.params.id], err => {
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
