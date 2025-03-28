// Requiere Node.js y Express
// Base de datos: SQLite con Sequelize ORM

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Conexión a SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'incidents.sqlite'
});

// Definición del modelo Incident
const Incident = sequelize.define('Incident', {
  reporter: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [10],
        msg: 'La descripción debe tener al menos 10 caracteres.'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'en proceso', 'resuelto'),
    defaultValue: 'pendiente'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false
});

// Sincronizar base de datos
sequelize.sync();

// Crear incidente
app.post('/incidents', async (req, res) => {
  const { reporter, description } = req.body;
  try {
    const incident = await Incident.create({ reporter, description });
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los incidentes
app.get('/incidents', async (req, res) => {
  const incidents = await Incident.findAll();
  res.json(incidents);
});

// Obtener incidente por ID
app.get('/incidents/:id', async (req, res) => {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incidente no encontrado' });
  res.json(incident);
});

// Actualizar status del incidente
app.put('/incidents/:id', async (req, res) => {
  const { status } = req.body;
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incidente no encontrado' });
  incident.status = status;
  await incident.save();
  res.json(incident);
});

// Eliminar incidente
app.delete('/incidents/:id', async (req, res) => {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incidente no encontrado' });
  await incident.destroy();
  res.json({ message: 'Incidente eliminado' });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000');
});
