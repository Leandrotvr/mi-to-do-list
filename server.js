const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// IMPORTANTE: Usa la URL de tu base de datos de la lista de tareas
mongoose.connect('mongodb+srv://<db_username>:<db_password>@cluster0.4pf8z.mongodb.net/todo-list?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

const tareaSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Tarea = mongoose.model('Tarea', tareaSchema);

app.get('/api/tasks', async (req, res) => {
  const tareas = await Tarea.find();
  res.json(tareas);
});

app.post('/api/tasks', async (req, res) => {
  const nuevaTarea = new Tarea({
    text: req.body.text,
    completed: false,
  });
  await nuevaTarea.save();
  res.json(nuevaTarea);
});

app.put('/api/tasks/:id', async (req, res) => {
  const tarea = await Tarea.findById(req.params.id);
  tarea.completed = req.body.completed;
  await tarea.save();
  res.json(tarea);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  res.json({ message: 'Tarea eliminada' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});