// Redirect if cookies exists

function redirect(){
    if (document.cookie.includes('user')) {
        window.location.href = "../../index.php";
    }
}

redirect();

// Show password module

const checkboxBtn = document.getElementById('hidden-checkbox');
checkboxBtn.addEventListener('click', function () {
    showPasswords();
});

function showPasswords() {

    const password = document.getElementById('password');
    const password2 = document.getElementById('password2');

    if (password.getAttribute('type')=='password') { //changing type of input field
        password.type='text'
        if(password2){
            password2.type='text'
        }
    } else {
        password.type='password'
        if(password2){
            password2.type='password'};
    }
}

// Submit form valdation (check passwords)

function formValidation(){

    const errorMessage = document.getElementById('error__message');
    const password = document.getElementById('password');
    const password2 = document.getElementById('password2');

    if(password.value == password2.value){
        errorMessage.innerHTML = "";
        return true;
    }
    errorMessage.innerHTML = "Passwords do not much";
    return false;
}

//Send login and register to db

const loginForm = document.getElementById('login__form');
if(loginForm){
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        userLoginRequest();
    });
}


const registerForm = document.getElementById('register__form');
if(registerForm){
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if(formValidation()){
            userRegisterRequest();
        }
    });
}

function userLoginRequest() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; 

    fetch("../../backend/authentification.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:     
            `userEmail=${encodeURIComponent(email)}&` +
            `userPassword=${encodeURIComponent(password)}`
    })
    .then(response => {
        if (response.ok) {
            console.log("Login sucess");
            if (!document.cookie.includes('user')) {
                const errorMessage = document.getElementById('error__message');
                errorMessage.innerHTML = "Login or password is wrong";
            } else {
                redirect();
            }
        } else {
            console.error("Login error:", response.status);
        }
    })
    .catch(error => {
        console.error("Fetch API error:", error);
    });
}

function userRegisterRequest() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; 

    fetch("../../backend/authentification.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:     
            `userEmailRegister=${encodeURIComponent(email)}&` +
            `userPasswordRegister=${encodeURIComponent(password)}`
    })
    .then(response => {
        if (response.ok) {
            console.log("Register sucess");
            if (!document.cookie.includes('user')) {
                const errorMessage = document.getElementById('error__message');
                errorMessage.innerHTML = "Login is taken";
            } else {
                redirect();
            }
        } else {
            console.error("Register error:", response.status);
        }
    })
    .catch(error => {
        console.error("Fetch API error:", error);
    });
}