const allElems = document.querySelectorAll('.elem');
const allFullElems = document.querySelectorAll('.fullElem');
const backBtns = document.querySelectorAll('.back');
console.log(allElems);


function hideAll() {
    allFullElems.forEach(section => {
        section.classList.remove('active');
    });
}

// open section
allElems.forEach((elem, index) => {
    elem.addEventListener('click', () => {
        hideAll();
        allFullElems[index].classList.add('active');
    });
});

// back button close
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideAll();
    });
});


// TODO List Logic
let form = document.querySelector('.add-task form');
let taskInput = document.querySelector('.add-task input');
let taskDetailsInput = document.querySelector('.add-task textarea');
let taskCheckImp = document.querySelector('#important');
let allTasksContainer = document.querySelector('.all-tasks');

let currentTask = [
    {
        task: 'Task 1',
        details: 'Details of Task 1',
        isImportant: true,
        completed: false
    },
    {
        task: 'Task 2',
        details: 'Details of Task 2',
        isImportant: false,
        completed: false
    }
];

loadTasks();
renderTasks();

function renderTasks() {
    let clutter = "";

    currentTask.forEach((taskObj, index) => {
        clutter += `
            <div class="task ${taskObj.completed ? 'done' : ''}">
                <h5>
                    ${taskObj.task}
                    ${taskObj.isImportant ? '<sup class="imp-task">imp</sup>' : ''}
                </h5>
                

                <div class="task-actions">
                    <button onclick="toggleComplete(${index})">
                        ${taskObj.completed ? 'Undo' : 'Mark as Completed'}
                    </button>

                    <button class="delete-btn" onclick="deleteTask(${index})">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });

    allTasksContainer.innerHTML = clutter;
}

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(currentTask));
}

function loadTasks() {
    let saved = localStorage.getItem("todoTasks");
    if (saved && JSON.parse(saved).length) {
        currentTask = JSON.parse(saved);
    }
}

// ✅ Toggle complete
function toggleComplete(index) {
    currentTask[index].completed = !currentTask[index].completed;
    saveTasks();
    renderTasks();
}

// 🗑 Delete task
function deleteTask(index) {
    currentTask.splice(index, 1);
    saveTasks();
    renderTasks();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let taskText = taskInput.value.trim();
    let taskDetails = taskDetailsInput.value.trim();
    let isImportant = taskCheckImp.checked;

    if (taskText && taskDetails) {
        currentTask.push({
            task: taskText,
            details: taskDetails,
            isImportant: isImportant,
            completed: false
        });

        saveTasks();
        renderTasks();
        form.reset();
    }
});
