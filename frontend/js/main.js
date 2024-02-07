// Function check is this user or guest
function redirect(){
    if (!document.cookie.includes('user')) {
        window.location.href = "../../index.php";
    }
}

redirect();

// Function create "Loading..." status
var h1Element = document.createElement('h1');
h1Element.textContent = 'Loading...';
h1Element.classList.add('loading__status');
var mainContainer = document.getElementById('main');
mainContainer.appendChild(h1Element);

// Function loads notes from db
document.addEventListener('DOMContentLoaded', function() {
setTimeout(function() {
    h1Element.remove();
    let container = document.getElementById('dbNotes'); 
    container.innerHTML = ""

    fetch("../../backend/main.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `loadNotes=loadNotes`
    })
    .then(response => response.text())
    .then(data => {
        data += `<div id="add__note" class="add__note">
                    <p class="add__note__text"><span>+</span>Add one more note</p>
                </div>`;
        container.innerHTML = data;


// Delete cookies (logout) + redirect 

const logoutBtn = document.getElementById('logout-btn'); 
logoutBtn.addEventListener('click', function () {

    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    redirect();

});

// Show/hide menu module

const menuButtons = document.querySelectorAll('.menu-btn'); // adding click listeners to all menu-btn buttons 
menuButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        createMenu(button);
    });
});

function createMenu(clickedButton){
    const note = clickedButton.closest('.note'); // check if menu already exists
    if(!note.querySelector('.note__menu')){

        const colorClass = Array.from(note.classList).find(
            className => className !== 'note'); // defining color of parent (note)

        const menu = document.createElement('div'); // creating menu with same color as parent
        menu.classList.add('note__menu', colorClass);

        menu.innerHTML = `
        <p class="menu__heading">Action list</p>
        <button class="menu__close-btn">✖</button>
        <ul class="list-section">
            <li class="list__action delete__note-btn">Delete note</li>
        </ul>
        `;
        note.appendChild(menu);

        const closeBtn = menu.querySelector('.menu__close-btn'); // delete menu if closeBtn was clicked
        closeBtn.addEventListener('click', function () {
        menu.remove(); 
        });

        document.addEventListener('click', function (event) { // delete menu if listener catches any click outside the menu
        if (!menu.contains(event.target) && !clickedButton.contains(event.target)) {
            menu.remove(); 
        }
        });

        const deleteNoteBtn = menu.querySelector('.delete__note-btn'); // delete menu if closeBtn was clicked
        deleteNoteBtn.addEventListener('click', function () {
            deleteNote(note);
        });
    } else {
        note.querySelector('.note__menu').remove();
    }

}

// Edit task "text" (title) module

const changeTaskBtn = document.querySelectorAll('.change__task-btn'); //search for all edit taskText buttons
changeTaskBtn.forEach(function (button) {
    button.addEventListener('click', function () {
        const noteTask = button.closest('.note__task');
        const taskText = focusTask(noteTask);
        selectText(taskText);
    });
});


function selectText(el) { // Function that selects text

    const range = document.createRange(); // Select the contents of the given element (el)
    range.selectNodeContents(el);
  
    const selection = window.getSelection(); // remove all existing ranges from browser window 
    selection.removeAllRanges();             // and add new range to the selection
    selection.addRange(range);
}

function focusTask(noteTask) { // Function that focus task "text" (title)

    const taskButton = noteTask.querySelector('.change__task-btn');
    const taskCover = taskButton.previousElementSibling;
    const taskText = taskButton.nextElementSibling;

   
    document.addEventListener('click', function (event) { //making text unfocused and uneditable 
        if (!noteTask.contains(event.target)) {           //after clicking outside the task
            taskButton.insertAdjacentElement('beforebegin', taskCover);
            taskText.contentEditable = false;
        }
    });

    taskCover.remove(); //making text focused and editable
    taskText.contentEditable = true;
    taskText.focus();
    return taskText;
}

// Add new task module

const newTaskButtons = document.querySelectorAll('.add__task-btn'); // Add new task function
newTaskButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        createTask(button);
    });
});


function createTask(button){
    
    const newTask = document.createElement('div'); //creating new task
    newTask.classList.add('note__task');
    newTask.innerHTML = `
    <div class="task__cover"></div>
    <img class="change__task-btn" src="../assets/img/pencil.svg">
    <p class="task__text">Task title...</p>
    <input type='hidden' class='taskId' name='taskId' value='none' />
    <input type='hidden' class='taskContent' name='taskContent' value='' />
    `;
    
    button.insertAdjacentElement('beforebegin', newTask);
    // Running away from music
    setTimeout(() => {
        const popupBtn = newTask.querySelector('.task__cover'); 
        popupBtn.addEventListener('click', function () {
            createPopup(popupBtn);
        });
        const newTaskText = focusTask(newTask);
        selectText(newTaskText);
        const taskButton = newTask.querySelector('.change__task-btn');
        taskButton.addEventListener('click', function () {
            const noteTask = taskButton.closest('.note__task');
            const taskText = focusTask(noteTask);
            selectText(taskText);
        });
    }, 0);

}

// Add new note module
const addNoteBtn = document.getElementById('add__note');
addNoteBtn.addEventListener('click', function () {
    createNote(addNoteBtn);
});

function createNote(button){
    
    const newNote = document.createElement('div'); //creating new task
    newNote.classList.add('note', 'cream');
    newNote.innerHTML = `
    <input type='hidden' class='noteId' name='noteId' value='none' />
    <div class="note__header">
        <h2 contenteditable class="note__heading">Note title..</h2>
        <button class="menu-btn">···</button>
    </div>  
    <button class="add__task-btn">+ Add new task</button>
    `;
    
    button.insertAdjacentElement('beforebegin', newNote);

    const noteHeading = newNote.querySelector('.note__heading ');
    selectText(noteHeading);
    const menuBtn = newNote.querySelector('.menu-btn');
    menuBtn.addEventListener('click', function () {
        createMenu(menuBtn);
    });
    const taskButton = newNote.querySelector('.add__task-btn');
    taskButton.addEventListener('click', function () {
        createTask(taskButton);
    });

}

// note popup module

const popupBtn = document.querySelectorAll('.task__cover'); 
popupBtn.forEach(function (button) {
    button.addEventListener('click', function () {
        createPopup(button);
    });
});

function createPopup(clickedButton){

    const noteTask = clickedButton.closest('.note__task'); // Taking note task title
    const noteTextElement = noteTask.querySelector('.task__text'); 
    const noteText = noteTextElement.textContent;
    const taskContentElement = noteTask.querySelector('.taskContent'); 
    const taskContent = taskContentElement.value;

    const popup = document.createElement('div'); // Creating popup
    popup.classList.add('popup');

    popup.innerHTML = `
    <div id="popup-background" class="popup-background"></div>
    <div class="popup-container">
        <div class="popup-content">
            <h1 id="content-heading" class="content-heading" contenteditable>Add title here...</h1>
            <p id="content-text" class="content-text" contenteditable>Your text goes here...</p>
        </div>
        <div class="popup-menu">
        <ul class="list-section">
            <li class="list__action" id="deleteTaskBtn">Delete task</li>
        </ul>
        </div>
    </div>
    `;
    document.body.appendChild(popup);

    const contentHeading = document.getElementById('content-heading'); // Adding note task title to popup heading
    const contentText = document.getElementById('content-text'); // Adding note task title to popup heading
    if (!noteText==''){
        contentHeading.innerHTML = noteText; 
    }
    if (!taskContent==''){
        contentText.innerHTML = taskContent; 
    }
    
    const popupBackground = document.getElementById('popup-background'); // closing popup + updating task title
    popupBackground.addEventListener('click', function () {
        noteTextElement.innerHTML = contentHeading.innerHTML;
        taskContentElement.value = contentText.innerHTML
        popup.remove();
    });

    const deleteTaskBtn = document.getElementById('deleteTaskBtn');
    deleteTaskBtn.addEventListener('click', function () {
        deleteTask(noteTask, popup);
    });
}

// Function that delete notes
function deleteNote(note){
    const noteId = note.querySelector('.noteId').value; 
    if(noteId == 'none'){
        note.remove();
    } else {
        fetch("../../backend/main.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:     
                `deleteNote=${encodeURIComponent(noteId)}`
        })
        .then(response => {
            if (response.ok) {
                console.log("Note deleted");
                note.remove();
            } else {
                console.error("<<Delete note>> error:", response.status);
            }
        })
        .catch(error => {
            console.error("Fetch API error:", error);
        });
    }
    
}

// Function that delete tasks
function deleteTask(task, popup){
    const taskId = task.querySelector('.taskId').value; 
    if(taskId == 'none'){
        task.remove();
        popup.remove();
    } else {
        fetch("../../backend/main.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:     
                `deleteTask=${encodeURIComponent(taskId)}`
        })
        .then(response => {
            if (response.ok) {
                console.log("Task deleted");
                task.remove();
                popup.remove();
            } else {
                console.error("<<Delete task>> error:", response.status);
            }
        })
        .catch(error => {
            console.error("Fetch API error:", error);
        });
    }
    
}

// This function gets data from cookies
const cookiesObject = document.cookie.split('; ').reduce((obj, cookie) => {
    const [name, value] = cookie.split('=');
    obj[name] = decodeURIComponent(value); 
    return obj;
}, {});

// This function updates db when windows is gonna be closed
function updateDbTables() {
    const notes = document.querySelectorAll('.note'); 
    const userEmail = cookiesObject['user'];
    sqlUpdateArray = [];
    notes.forEach(function (note) {
        let noteId = note.querySelector('.noteId').value;
        const noteTitle = note.querySelector('.note__heading').textContent;

        if(noteId == 'none'){
            const biggestNoteId = document.getElementById('biggestNoteId').value; 
            noteId = parseInt(biggestNoteId)+1;;
            document.getElementById('biggestNoteId').value = noteId;
            const sqlQuery = "INSERT INTO `notes` (`title`, `user`) VALUES ('"+noteTitle+"', '"+userEmail+"');";
            sqlUpdateArray.push(sqlQuery);
        } else {
            const sqlQuery = "UPDATE `notes` SET `title` = '"+noteTitle+"', `user` = '"+userEmail+"' WHERE id LIKE '"+noteId+"';";
            sqlUpdateArray.push(sqlQuery);
        }

        const tasks = note.querySelectorAll('.note__task'); 
        tasks.forEach(function (task) {
            const taskId = task.querySelector('.taskId').value;   
            const taskTitle = task.querySelector('.task__text').textContent; 
            const taskContent = task.querySelector('.taskContent').value;

            if(taskId == 'none'){
                const sqlQuery = "INSERT INTO `tasks` (`title`, `content`, `noteID`) VALUES ('"+taskTitle+"', '"+taskContent+"', '"+noteId+"');";
                sqlUpdateArray.push(sqlQuery);
            } else {
                const sqlQuery = "UPDATE `tasks` SET `title` = '"+taskTitle+"', `content` = '"+taskContent+"', noteID = '"+noteId+"' WHERE id LIKE '"+taskId+"';";
                sqlUpdateArray.push(sqlQuery);
            }
        });
    });
    fetch("../../backend/main.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ updateDbTables: sqlUpdateArray })
    })
    .then(response => {
        if (response.ok) {
            console.log("Db was sucessfully updated");
        } else {
            console.error("Update Db went wrong:", response.status);
        }
    })
    .catch(error => {
        console.error("Fetch API error:", error);
    });
}

window.addEventListener("beforeunload", (event) => {
    updateDbTables();
});









})
.catch(error => {
    console.error("Fetch API error:", error);
});
}, 1000);
});
