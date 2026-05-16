const form = document.querySelector("#login-form");
const message = document.querySelector("#login-message");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    message.className = "";
    message.textContent = "";

    if (username.length < 3) {

        message.textContent = "Username must be at least 3 characters long.";
        message.classList.add("error-message");
        return;
    }

    if (password.length < 4) {

        message.textContent = "Password must be at least 4 characters long.";
        message.classList.add("error-message");
        return;
    }

    message.textContent = "Login successful. Redirecting...";
    message.classList.add("success-message");

    setTimeout(function() {
        window.location.href = "mainPage.html";
    }, 1000);
});