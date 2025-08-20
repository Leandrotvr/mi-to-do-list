import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://tu-url-de-backend.onrender.com/api/tasks');
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    await fetch('https://tu-url-de-backend.onrender.com/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: nuevaTarea }),
    });
    setNuevaTarea('');
    fetchTareas();
  };

  const completarTarea = async (id, completed) => {
    await fetch(`https://tu-url-de-backend.onrender.com/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTareas();
  };

  const eliminarTarea = async (id) => {
    await fetch(`https://tu-url-de-backend.onrender.com/api/tasks/${id}`, {
      method: 'DELETE',
    });
    fetchTareas();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Deja tu chiste</h1>
        <form onSubmit={agregarTarea}>
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Añade una tontería graciosa..."
          />
          <button type="submit">Añadir</button>
        </form>
        {loading ? (
          <p>Cargando chistes...</p>
        ) : tareas.length > 0 ? (
          <ul className="todo-list">
            {tareas.map((tarea) => (
              <li key={tarea._id} className={tarea.completed ? 'completed' : ''}>
                <span onClick={() => completarTarea(tarea._id, tarea.completed)}>
                  {tarea.text}
                </span>
                <button onClick={() => eliminarTarea(tarea._id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>¡No hay chistes!</p>
        )}
      </header>
    </div>
  );
}

export default App;