import React, { useState, useEffect } from 'react';
import './App.css';
import Tarea from './Tarea';

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
      const response = await fetch('https://mi-lista-api.onrender.com/api/tasks');
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarTarea = async (textoTarea) => {
    const response = await fetch('https://mi-lista-api.onrender.com/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textoTarea }),
    });
    if (response.ok) {
      fetchTareas();
    }
  };

  const completarTarea = async (id, completada) => {
    await fetch(`https://mi-lista-api.onrender.com/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !completada }),
    });
    fetchTareas();
  };

  const eliminarTarea = async (id) => {
    await fetch(`https://mi-lista-api.onrender.com/api/tasks/${id}`, {
      method: 'DELETE',
    });
    fetchTareas();
  };

  const handleAgregarTarea = (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    agregarTarea(nuevaTarea);
    setNuevaTarea('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Tareas</h1>
        <form onSubmit={handleAgregarTarea}>
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Añadir una nueva tarea..."
          />
          <button type="submit">Añadir</button>
        </form>
        {loading ? (
          <p>Cargando tareas...</p>
        ) : tareas.length > 0 ? (
          tareas.map(tarea => (
            <Tarea
              key={tarea._id}
              tarea={{ texto: tarea.text, completada: tarea.completed, id: tarea._id }}
              onCompletar={() => completarTarea(tarea._id, tarea.completed)}
              onEliminar={() => eliminarTarea(tarea._id)}
            />
          ))
        ) : (
          <p>¡No hay tareas!</p>
        )}
      </header>
    </div>
  );
}

export default App;