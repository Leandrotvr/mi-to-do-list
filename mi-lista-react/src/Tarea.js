import React from 'react';

const Tarea = ({ tarea, onCompletar, onEliminar }) => {
  return (
    <div style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}>
      <span>{tarea.texto}</span>
      <button onClick={onCompletar}>Completar</button>
      <button onClick={onEliminar}>Eliminar</button>
    </div>
  );
};

export default Tarea;