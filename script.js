document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    // Función para obtener y mostrar las tareas
    const fetchTasks = async () => {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `${task.text} <button onclick="deleteTask('${task._id}')">Eliminar</button>`;
            if (task.completed) {
                li.style.textDecoration = 'line-through';
            }
            taskList.appendChild(li);
        });
    };

    // Función para añadir una nueva tarea
    const addTask = async () => {
        const text = taskInput.value.trim();
        if (text === '') return;

        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        taskInput.value = '';
        fetchTasks();
    };

    // Asignar el evento click al botón "Añadir"
    addButton.addEventListener('click', addTask);

    // Cargar las tareas al iniciar la página
    fetchTasks();
});

// Esta función debe ser global para que el onclick del HTML la encuentre
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    // Recargar la lista de tareas después de eliminar
    location.reload(); 
}