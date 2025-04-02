const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

// GET todos
router.get('/', (req, res) => {
  db.all('SELECT * FROM incidents', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET por id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM incidents WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Incidente no encontrado' });
    res.json(row);
  });
});

// POST crear incidente
router.post('/', (req, res) => {
  const { reporter, description } = req.body;
  if (!reporter || !description || description.length < 10) {
    return res.status(400).json({ error: 'Datos inválidos: reporter obligatorio y descripción >= 10 caracteres' });
  }
  const stmt = db.prepare('INSERT INTO incidents (reporter, description) VALUES (?, ?)');
  stmt.run(reporter, description, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, reporter, description, status: 'pendiente', created_at: new Date() });
  });
  stmt.finalize();
});

// PUT actualizar solo estado
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const estadosValidos = ['pendiente', 'en proceso', 'resuelto'];
  if (!estadosValidos.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido. Debe ser: pendiente, en proceso o resuelto' });
  }
  db.run('UPDATE incidents SET status = ? WHERE id = ?', [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Incidente no encontrado' });
    res.json({ message: 'Estado actualizado correctamente' });
  });
});

// DELETE eliminar
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM incidents WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Incidente no encontrado' });
    res.json({ message: 'Incidente eliminado correctamente' });
  });
});

module.exports = router;
