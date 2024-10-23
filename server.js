const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movies",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected...");
});

// Endpoint to add a new program
app.post("/add-program", (req, res) => {
  const {
    title,
    description,
    status,
    videoURL,
    duration,
    channel,
    category,
    type,
  } = req.body;
  if (
    !title ||
    !description ||
    !status ||
    !videoURL ||
    !duration ||
    !channel ||
    !category ||
    !type
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO program (title, description, status, videoURL, duration, channel, category, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [title, description, status, videoURL, duration, channel, category, type],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res
        .status(200)
        .json({ message: "Program added successfully", data: result });
    }
  );
});

// Endpoint to add a new channel
app.post("/add-channel", (req, res) => {
  const { name, status } = req.body;
  if (!name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO channel (name,status) VALUES (?,?)";
  db.query(sql, [name, status], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(200)
      .json({ message: "Channel added successfully", data: result });
  });
});

// Endpoint to fetch all programs
app.get("/programs", (req, res) => {
  const sql = "SELECT * FROM program";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ data: results });
  });
});

// Endpoint to fetch all channels
app.get("/channels", (req, res) => {
  const sql = "SELECT * FROM channel";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ data: results });
  });
});

// Endpoint to update a program
app.put("/update-program/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    videoURL,
    duration,
    channel,
    category,
    type,
  } = req.body;

  const sql =
    "UPDATE program SET title = ?, description = ?, status = ?, videoURL = ?, duration = ?, channel = ?, category = ?, type = ? WHERE id = ?";
  db.query(
    sql,
    [
      title,
      description,
      status,
      videoURL,
      duration,
      channel,
      category,
      type,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.status(200).json({ message: "Program updated successfully" });
    }
  );
});
app.put("/update-channel/:id", (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  const sql = "UPDATE channel SET name = ?,status = ? WHERE id = ?";
  db.query(sql, [name, status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    res.status(200).json({ message: "Program updated successfully" });
  });
});
// Endpoint to delete a program
app.delete("/delete-program/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM program WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    res.status(200).json({ message: "Program deleted successfully" });
  });
});

app.delete("/delete-channel/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM channel WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    res.status(200).json({ message: "Channel deleted successfully" });
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
