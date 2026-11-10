
document.addEventListener("DOMContentLoaded", function () {

    // DOM Elements
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addBtn = document.getElementById("addBtn");
    const emptyMessage = document.getElementById("emptyMessage");
    const totalTasks = document.getElementById("totalTasks");
    const pendingTasks = document.getElementById("pendingTasks");
    const completedTasks = document.getElementById("completedTasks");
    const allCount = document.getElementById("allCount");
    const pendingCount = document.getElementById("pendingCount");
    const completedCount = document.getElementById("completedCount");
    const visibleCount = document.getElementById("visibleCount");
    const listTitle = document.getElementById("listTitle");
    const currentDate = document.getElementById("currentDate");

    let tasks = [];

    try {
        const savedTasks = JSON.parse(
            localStorage.getItem("taskoraTasks")
        );

        if (Array.isArray(savedTasks)) {
            tasks = savedTasks;
        }
    } catch (error) {
        console.error("Unable to load saved tasks:", error);
    }

    let currentFilter = "all";
    let editId = null;

    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }

    function saveTasks() {
        localStorage.setItem(
            "taskoraTasks",
            JSON.stringify(tasks)
        );
    }
    function resetEditMode() {
        editId = null;
        taskInput.value = "";
        addBtn.innerHTML = "<span>+</span> Add Task";
    }

    // Add or Update Task
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const taskValue = taskInput.value.trim();
        if (!taskValue) {
            alert("Please enter a task!");
            return;
        }
        if (editId !== null) {
            const task = tasks.find(
                item => item.id === editId
            );

            if (task) {
                task.text = taskValue;
            }
            resetEditMode();
        } else {
            tasks.push({
                id: Date.now(),
                text: taskValue,
                completed: false
            });
        }
        taskInput.value = "";
        saveTasks();
        displayTasks();
    });

    // Display Tasks and Empty Message
    function displayTasks() {
        taskList.innerHTML = "";
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "pending") {
                return !task.completed;
            }
            if (currentFilter === "completed") {
                return task.completed;
            }
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "task-item";

            if (task.completed) {
                li.classList.add("completed");
            }
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                "aria-label",
                "Mark task as completed"
            );
            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                saveTasks();
                displayTasks();
            });

            const span = document.createElement("span");
            span.className = "task-text";
            span.textContent = task.text;

            const actions = document.createElement("div");
            actions.className = "actions";

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";

            editBtn.addEventListener("click", function () {
                taskInput.value = task.text;
                editId = task.id;

                addBtn.innerHTML =
                    "<span>✓</span> Update Task";

                taskInput.focus();
                taskForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            });
            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", function () {
                if (editId === task.id) {
                    resetEditMode();
                }

                tasks = tasks.filter(
                    item => item.id !== task.id
                );

                saveTasks();
                displayTasks();
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(actions);
            taskList.appendChild(li);
        });
        updateStatistics();
        if (filteredTasks.length === 0) {
            emptyMessage.style.display = "flex";
            const heading = emptyMessage.querySelector("h3");
            const paragraph = emptyMessage.querySelector("p");

            if (currentFilter === "pending" && tasks.length > 0) {
                heading.textContent = "All caught up!";
                paragraph.textContent =
                    "You have no pending tasks.";
            } else if (
                currentFilter === "completed" &&
                tasks.length > 0
            ) {
                heading.textContent = "Nothing completed yet";
                paragraph.textContent =
                    "Complete a task and it will appear here.";
            } else {
                heading.textContent = "No tasks yet";
                paragraph.textContent =
                    "Add your first task and start being productive.";
            }
        } else {
            emptyMessage.style.display = "none";
        }

        if (visibleCount) {
            visibleCount.textContent =
                `${filteredTasks.length} ${
                    filteredTasks.length === 1 ? "task" : "tasks"
                }`;
        }
    }
    function updateStatistics() {
        const total = tasks.length;

        const completed = tasks.filter(
            task => task.completed
        ).length;
        const pending = total - completed;
        if (totalTasks) totalTasks.textContent = total;
        if (pendingTasks) pendingTasks.textContent = pending;
        if (completedTasks) completedTasks.textContent = completed;

        if (allCount) allCount.textContent = total;
        if (pendingCount) pendingCount.textContent = pending;
        if (completedCount) completedCount.textContent = completed;
    }
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(button => {
        button.addEventListener("click", function () {
            navItems.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            currentFilter = button.dataset.filter;

            if (listTitle) {
                if (currentFilter === "all") {
                    listTitle.textContent = "All Tasks";
                } else if (currentFilter === "pending") {
                    listTitle.textContent = "Pending Tasks";
                } else {
                    listTitle.textContent = "Completed Tasks";
                }
            }
            if (editId !== null) {
                resetEditMode();
            }
            displayTasks();
        });
    });
    displayTasks();
});