<?php
include('db_connect.php');

# Function load notes on  website
if (isset($_POST['loadNotes'])) {
    $usersEmail = $_COOKIE['user'];
    $query = mysqli_query($start, "SELECT * FROM `notes` WHERE `user`='{$usersEmail}'");
    foreach($query as $row) {
        $noteTitle = $row['title'];
        $id = $row['id'];
        echo "<div class='note cream'>
                <input type='hidden' class='noteId' name='noteId' value='$id' />
                <div class='note__header'>
                <h2 contenteditable class='note__heading'>$noteTitle</h2>
                <button class='menu-btn'>···</button>
                </div>";
        $query = mysqli_query($start, "SELECT * FROM `tasks` WHERE `noteID`='{$id}'");
        foreach($query as $row) {
            $taskTitle = $row['title'];
            $content = $row['content'];
            $taskId = $row['id'];
            echo "<div class='note__task'>
                    <div class='task__cover'></div>
                    <img class='change__task-btn' src='../assets/img/pencil.svg'>
                    <p class='task__text'>$taskTitle</p>
                    <input type='hidden' class='taskId' name='taskId' value='$taskId' />
                    <input type='hidden' class='taskContent' name='taskContent' value='$content' />
                </div>";
        }
        echo "<button class='add__task-btn'>+ Add new task</button>
            </div>";  
    }
    $query = mysqli_query($start, "SELECT MAX(id) AS max_id FROM notes");
    foreach($query as $row) {
        $maxId = $row['max_id'];
        if ($maxId == NULL) {
            $query = mysqli_query($start, "ALTER TABLE notes AUTO_INCREMENT = 1;");
            $maxId = 0;
        } 
    }
    echo "<input type='hidden' id='biggestNoteId' name='taskContent' value='$maxId' />";   
}


# Function delete notes
if (isset($_POST['deleteNote'])) {

    $noteId = $_POST['deleteNote'];
    $query = mysqli_query($start, "DELETE FROM `notes` WHERE id = '$noteId';");
    $query = mysqli_query($start, "DELETE FROM `tasks` WHERE noteID = '$noteId';");
}

# Function delete tasks
if (isset($_POST['deleteTask'])) {

    $taskId = $_POST['deleteTask'];
    $query = mysqli_query($start, "DELETE FROM `tasks` WHERE id = '$taskId';");
}

#updateDbTables notes and tasks
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['updateDbTables'])) {
    $updateDbTables = $data['updateDbTables'];
    foreach($updateDbTables as $query) {
        mysqli_query($start, $query);
        echo $query;
    }
} 
