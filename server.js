const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://leandrotvr2:Kurup1_N43@cluster0.4pf8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Middleware para procesar JSON
app.use(express.json());

// Servir los archivos estáticos
app.use(express.static(path.join(__dirname)));

let tasksCollection;

async function connectToDatabase() {
    await client.connect();
    const database = client.db("mi-to-do-list-db");
    tasksCollection = database.collection("tasks");
    console.log("Conectado a la base de datos de MongoDB!");
}

// Conectar a la base de datos y luego iniciar el servidor
connectToDatabase().then(() => {
    // Rutas API para las tareas
    app.get('/api/tasks', async (req, res) => {
        const tasks = await tasksCollection.find({}).toArray();
        res.json(tasks);
    });

    app.post('/api/tasks', async (req, res) => {
        const newTask = { text: req.body.text, completed: false };
        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json(result.ops[0]);
    });

    app.delete('/api/tasks/:id', async (req, res) => {
        const taskId = new ObjectId(req.params.id);
        await tasksCollection.deleteOne({ _id: taskId });
        res.status(204).end();
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });

}).catch(console.error);