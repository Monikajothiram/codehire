const db = require('../config/db');

exports.getAllProblems = (req, res) => {
  const sql = 'SELECT id, title, difficulty FROM problems';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

exports.getProblemById = (req, res) => {
  const sql = 'SELECT * FROM problems WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Problem not found' });
    res.json(results[0]);
  });
};

exports.createProblem = (req, res) => {
  const { title, description, difficulty, testcases } = req.body;
  const sql = 'INSERT INTO problems (title, description, difficulty, testcases) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, description, difficulty, JSON.stringify(testcases)], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Problem created', id: result.insertId });
  });
};