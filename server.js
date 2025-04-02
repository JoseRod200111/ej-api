const express = require('express');
const app = express();
const port = 3000;
const incidentRoutes = require('./routes/incidents');

app.use(express.json());
app.use('/incidents', incidentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});
