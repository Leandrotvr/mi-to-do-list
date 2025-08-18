document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
                throw new Error('Error al obtener las tareas');
            }
            const tasks = await response.json();
            taskList.innerHTML = '';
            tasks.forEach(task => {
                renderTask(task);
            });
        } catch (error) {
            console.error('No se pudo cargar la lista de tareas:', error);
            alert('Error al conectar con el servidor. Asegúrate de que está en funcionamiento.');
        }
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.dataset.taskId = task.id;
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn">Eliminar</button>
        `;

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    }

    async function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Por favor, escribe una tarea.');
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskText })
            });

            if (response.ok) {
                taskInput.value = '';
                fetchTasks();
            } else {
                throw new Error('Error al añadir la tarea');
            }
        } catch (error) {
            console.error('Error al añadir la tarea:', error);
            alert('No se pudo añadir la tarea. Revisa la conexión con el servidor.');
        }
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchTasks();
            } else {
                throw new Error('Error al eliminar la tarea');
            }
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            alert('No se pudo eliminar la tarea. Revisa la conexión con el servidor.');
        }
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    fetchTasks();
});