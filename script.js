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

let currentTask = [];

function renderTasks() {

    if (currentTask.length === 0) {
        allTasksContainer.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet</h3>
                <p>Add your first task to stay productive 🚀</p>
            </div>
        `;
        return;
    }

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

loadTasks();
renderTasks();



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


// daily planner logic


function DailyPlanner() {
    let dayplanner = document.querySelector('.day-planner');

    // Create time slots
    let hours = new Array(18).fill(0).map((_, i) => {
        let hour = i + 6;
        let period = hour >= 12 ? 'PM' : 'AM';
        let displayHour = hour % 12 === 0 ? 12 : hour % 12;
        let nextHour = (hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12;

        return `${displayHour}:00 - ${nextHour}:00 ${period}`;
    });

    // Load saved planner (array)
    let plannerData = JSON.parse(localStorage.getItem("plannerData")) || [];

    // Render UI
    function renderPlanner() {
        let html = "";

        hours.forEach((hour, index) => {
            html += `
            <div class="day-planner-time">
                <p>${hour}</p>
                <input type="text" placeholder="..." value="${plannerData[index] || ""}">
            </div>
        `;
        });

        dayplanner.innerHTML = html;

        attachSaveEvents();
    }

    // Save input values
    function attachSaveEvents() {
        let inputs = document.querySelectorAll('.day-planner-time input');

        inputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                plannerData[index] = input.value;
                localStorage.setItem("plannerData", JSON.stringify(plannerData));
            });
        });
    }

    renderPlanner();
}

DailyPlanner();




// ===== Motivational Quotes (API) =====

const quoteText = document.querySelector('.quote-text');
const quoteAuthor = document.querySelector('.quote-author');
const newQuoteBtn = document.querySelector('.new-quote-btn');

let quotesList = [];

// fetch quotes
async function fetchQuotes() {
    try {
        const res = await fetch("https://type.fit/api/quotes");
        quotesList = await res.json();
        loadQuote();
    } catch (err) {
        console.error("Couldn't fetch quotes:", err);
        quoteText.textContent = "Oops! Unable to load quotes.";
        quoteAuthor.textContent = "";
    }
}

// get random and display
function loadQuote() {
    if (!quotesList.length) return;

    let random = Math.floor(Math.random() * quotesList.length);
    let q = quotesList[random];

    quoteText.textContent = `"${q.text}"`;
    quoteAuthor.textContent = q.author ? `— ${q.author}` : "— Unknown";

}

newQuoteBtn.addEventListener('click', loadQuote);

fetchQuotes();



// ===== Pomodoro Timer =====
// 25 min focus timer chalata hai
// 👉 time khatam hote hi 5 min break pe switch hota hai
// 👉 phir wapas focus — automatic loop

let sessionType = document.querySelector(".session-type");
let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let resetBtn = document.getElementById("resetBtn");

let focusTime = 25 * 60;
console.log(focusTime); // 1500 seconds
let breakTime = 5 * 60; // 300 seconds
let timeLeft = focusTime;
let isFocus = true;
let interval = null;

function updateTimer() {
    let min = Math.floor(timeLeft / 60);  //  1500 / 60 = 25
    let sec = timeLeft % 60; // 1500 % 60 = 0
    timerDisplay.textContent =
        `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function startTimer() {
    if (interval) return;

    interval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            isFocus = !isFocus;

            if (isFocus) {
                timeLeft = focusTime;
                sessionType.textContent = "Focus Time";
            } else {
                timeLeft = breakTime;
                sessionType.textContent = "Break Time";
            }
        }

        updateTimer();
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    pauseTimer();
    isFocus = true;
    timeLeft = focusTime;
    sessionType.textContent = "Focus Time";
    updateTimer();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateTimer();



// ===== Daily Goals =====

const goalForm = document.querySelector(".goal-form");
const goalInput = goalForm.querySelector("input");
const goalsList = document.querySelector(".goals-list");
const progressBar = document.querySelector(".progress-bar span");
const progressText = document.querySelector(".progress-text");

let goals = JSON.parse(localStorage.getItem("dailyGoals")) || [];

function saveGoals() {
    localStorage.setItem("dailyGoals", JSON.stringify(goals));
}

function renderGoals() {

    if (goals.length === 0) {
        goalsList.innerHTML = "<p style='opacity:0.6'>No goals yet</p>";
        progressBar.style.width = "0%";
        progressText.textContent = "0% Completed";
        return;
    }

    let completed = goals.filter(goal => goal.done).length;
    let percent = Math.round((completed / goals.length) * 100);

    progressBar.style.width = percent + "%";
    progressText.textContent = percent + "% Completed";

    goalsList.innerHTML = "";

    goals.forEach((goal, index) => {
        goalsList.innerHTML += `
            <div class="goal-item ${goal.done ? "done" : ""}">
                <span onclick="toggleGoal(${index})">${goal.text}</span>
                <button onclick="deleteGoal(${index})">✕</button>
            </div>
        `;
    });
}

function toggleGoal(index) {
    goals[index].done = !goals[index].done;
    saveGoals();
    renderGoals();
}

function deleteGoal(index) {
    goals.splice(index, 1);
    saveGoals();
    renderGoals();
}

goalForm.addEventListener("submit", e => {
    e.preventDefault();

    if (goalInput.value.trim()) {
        goals.push({
            text: goalInput.value,
            done: false
        });

        goalInput.value = "";
        saveGoals();
        renderGoals();
    }
});

renderGoals();
