<?php
# Redirect function
if(!isset($_COOKIE['user'])){
  header('Location: /ToDoLists/frontend/pages/login.html');
} else {
  header('Location: /ToDoLists/frontend/pages/index.html');
};