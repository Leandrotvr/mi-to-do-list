document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    fetchTasks();

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            await addTask(text);
            taskInput.value = '';
        }
    });

    async function fetchTasks() {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    }

    async function addTask(text) {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        if (response.ok) {
            fetchTasks();
        }
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn" data-id="${task._id}">Eliminar</button>
            `;
            taskList.appendChild(li);
        });
    }

    taskList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = e.target.getAttribute('data-id');
            await deleteTask(taskId);
        }
    });

    async function deleteTask(id) {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchTasks();
        }
    }
});