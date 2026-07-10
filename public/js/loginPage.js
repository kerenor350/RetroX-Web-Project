const loginForm =
    document.getElementById("login-form");

const registerForm =
    document.getElementById("register-form");

const loginMessage =
    document.getElementById("login-message");

const registerMessage =
    document.getElementById("register-message");

// ===========================
// Show Login
// ===========================

function showLogin(){

    document.getElementById("loginBox").style.display = "block";

    document.getElementById("registerBox").style.display = "none";

}

// ===========================
// Show Register
// ===========================

function showRegister(){

    document.getElementById("loginBox").style.display = "none";

    document.getElementById("registerBox").style.display = "block";

}

// ===========================
// LOGIN
// ===========================

loginForm.addEventListener("submit", async function(e){

    e.preventDefault();

    loginMessage.textContent = "";

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (username.length < 3) {

        loginMessage.textContent =
            "Username must be at least 3 characters long.";

        return;

    }

    if (password.length < 4) {

        loginMessage.textContent =
            "Password must be at least 4 characters long.";

        return;

    }

    const response =
        await fetch("/login",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                username,
                password

            })

        });

    const result =
        await response.json();

    loginMessage.textContent =
        result.message;

    if(result.success){

        localStorage.setItem(

            "role",

            result.role

        );

        setTimeout(()=>{

            window.location.href="/profiles";

        },800);

    }

});

// ===========================
// REGISTER
// ===========================

registerForm.addEventListener("submit", async function(e){

    e.preventDefault();

    registerMessage.textContent = "";

    const username =
        document.getElementById("registerUsername").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();

    const confirmPassword =
        document.getElementById("registerPassword2").value.trim();

    if (username.length < 3) {

        registerMessage.textContent =
            "Username must contain at least 3 characters.";

        return;

    }

    if (password.length < 4) {

        registerMessage.textContent =
            "Password must contain at least 4 characters.";

        return;

    }

    if(password !== confirmPassword){

        registerMessage.textContent =
            "Passwords do not match.";

        return;

    }

    const response =
        await fetch("/register",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                username,
                password

            })

        });

    const result =
        await response.json();

    registerMessage.textContent =
        result.message;

    if(result.success){

        setTimeout(()=>{

            showLogin();

        },1000);

    }

});