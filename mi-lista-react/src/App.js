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
        <section className="portfolio-section" style={{
            backgroundColor: '#333',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            color: '#fff',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{
                color: '#4caf50',
                borderBottom: '2px solid #4caf50',
                paddingBottom: '10px'
            }}>
                Proyecto: Lista de Tareas
            </h2>
            <p style={{
                fontWeight: 'bold',
                marginTop: '15px'
            }}>
                Programador: Leandro Maciel
            </p>
            <p style={{
                marginBottom: '20px'
            }}>
                Contacto: 3777-416857 / leandrotvr@gmail.com
            </p>
            <p style={{
              fontWeight: 'bold',
              marginTop: '15px',
              marginBottom: '20px'
            }}>
              Visita el proyecto en vivo aquí: <a href="https://mi-to-do-list.onrender.com/" style={{color: '#fff', textDecoration: 'underline'}}>https://mi-to-do-list.onrender.com/</a>
            </p>

            <h3 style={{
                color: '#ffc107'
            }}>
                Tecnologías y Funciones Utilizadas
            </h3>
            <p style={{
                fontWeight: 'bold',
                marginTop: '10px'
            }}>
                Tecnologías del Stack MERN:
            </p>
            <ul style={{
                listStyleType: 'disc',
                paddingLeft: '20px'
            }}>
                <li>
                    <strong style={{ color: '#8bc34a' }}>MongoDB:</strong> Base de datos NoSQL para el almacenamiento de datos.
                </li>
                <li>
                    <strong style={{ color: '#2196f3' }}>Express.js:</strong> Framework de backend de Node.js para las rutas de la API.
                </li>
                <li>
                    <strong style={{ color: '#00bcd4' }}>React:</strong> Biblioteca de frontend para la interfaz de usuario.
                </li>
                <li>
                    <strong style={{ color: '#ff9800' }}>Node.js:</strong> Entorno de ejecución de JavaScript para el servidor.
                </li>
            </ul>

            <p style={{
                fontWeight: 'bold',
                marginTop: '15px'
            }}>
                Funciones Clave:
            </p>
            <ul style={{
                listStyleType: 'disc',
                paddingLeft: '20px'
            }}>
                <li>
                    <strong style={{ color: '#e91e63' }}>API RESTful:</strong> Creación de endpoints para las operaciones CRUD (Crear, Leer, Actualizar, Eliminar).
                </li>
                <li>
                    <strong style={{ color: '#f44336' }}>Despliegue:</strong> Despliegue de la aplicación completa en la plataforma Render.
                </li>
                <li>
                    <strong style={{ color: '#9c27b0' }}>Gestión de Datos:</strong> Manejo de datos y esquemas con Mongoose.
                </li>
                <li>
                    <strong style={{ color: '#3f51b5' }}>Control de Versiones:</strong> Uso de Git y GitHub para la gestión del código.
                </li>
            </ul>
        </section>
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