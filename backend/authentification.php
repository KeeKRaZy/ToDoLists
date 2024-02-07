<?php
include('db_connect.php');

# Login function
if (isset($_POST['userEmail'])) {
  
  $email = $_POST['userEmail'];
  $password = $_POST['userPassword'];
  $hashedPassword = md5($password);
  $query = mysqli_query($start, "SELECT * FROM `users` WHERE `email`='{$email}' AND `password`='{$hashedPassword}';");

  if (mysqli_num_rows($query) == 1) {
    setcookie('user', $email, time() + 36000, "/");
  } else { 
      #'Login or password is wrong';
  }
}

# Sign Up function
if (isset($_POST['userEmailRegister'])) {
  
  $email = $_POST['userEmailRegister'];
  $password = $_POST['userPasswordRegister'];
  $hashedPassword = md5($password);
  $query = mysqli_query($start, "SELECT * FROM `users` WHERE `email`='{$email}';");

  if (mysqli_num_rows($query) == 0) {
    $query = mysqli_query($start, "INSERT INTO `users` (`email`, `password`) VALUES ('$email', '$hashedPassword');");
    setcookie('user', $email, time() + 36000, "/");
  } else {
      #'Login is taken';
  }

}

