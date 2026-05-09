const db = require('../config/db');

exports.getAllContests = (req, res) => {
  const sql = 'SELECT * FROM contests ORDER BY start_time DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

exports.createContest = (req, res) => {
  const { title, duration_minutes, start_time } = req.body;
  const sql = 'INSERT INTO contests (title, duration_minutes, start_time) VALUES (?, ?, ?)';
  db.query(sql, [title, duration_minutes, start_time], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Contest created', id: result.insertId });
  });
};

exports.getContestById = (req, res) => {
  const sql = 'SELECT * FROM contests WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Contest not found' });
    res.json(results[0]);
  });
};