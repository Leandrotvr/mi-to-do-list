const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://leandrotvr:4m_15r43l_J41@cluster0.4pf8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Middleware para procesar JSON
app.use(express.json());

// Servir los archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

async function run() {
  try {
    await client.connect();
    const database = client.db("mi-to-do-list-db");
    const tasksCollection = database.collection("tasks");
    console.log("Conectado a la base de datos de MongoDB!");

    // Ruta para obtener todas las tareas
    app.get('/api/tasks', async (req, res) => {
        const tasks = await tasksCollection.find({}).toArray();
        res.json(tasks);
    });

    // Ruta para agregar una nueva tarea
    app.post('/api/tasks', async (req, res) => {
        const newTask = { text: req.body.text, completed: false };
        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json(result.ops[0]);
    });

    // Ruta para eliminar una tarea por ID
    app.delete('/api/tasks/:id', async (req, res) => {
        const taskId = new require('mongodb').ObjectId(req.params.id);
        const result = await tasksCollection.deleteOne({ _id: taskId });
        res.status(204).end();
    });

  } finally {
    // No cerrar la conexión aquí, ya que el servidor necesita seguir conectado.
  }
}

run().catch(console.dir);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});