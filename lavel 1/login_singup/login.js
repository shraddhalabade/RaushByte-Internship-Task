const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

   const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const result = await response.text();

    if (response.ok) {
         alert("Login successful!");
    } else {
        alert(result);
    }
} catch (error) {
    alert("Unable to connect to the server. Please try again.");
    console.error(error);
}});