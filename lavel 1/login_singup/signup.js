const signupForm = document.getElementById("signupForm");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const timerText = document.getElementById("timer");

let countdown;

function startTimer() {

    let timeLeft = 60;

    sendOtpBtn.disabled = true;

    timerText.innerText = `Resend OTP in ${timeLeft} seconds`;

    countdown = setInterval(() => {

        timeLeft--;

        timerText.innerText = `Resend OTP in ${timeLeft} seconds`;

        if (timeLeft <= 0) {

            clearInterval(countdown);

            sendOtpBtn.disabled = false;

            sendOtpBtn.innerText = "Resend OTP";

            timerText.innerText = "";

        }

    }, 1000);

}

sendOtpBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();

    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    sendOtpBtn.disabled = true;
    sendOtpBtn.innerText = "⏳ Sending OTP...";

    try {

        const response = await fetch(
            "http://localhost:5000/send-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }
        );

        const result = await response.text();

        alert(result);

    } catch (error) {

        console.log(error);
        alert("Something went wrong. Please try again.");

    } finally {

        sendOtpBtn.innerText = "Send OTP";
        sendOtpBtn.disabled = false;

    }

});


signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const otp = document.getElementById("otp").value.trim();

    // Password validation
    const isValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

    if (!isValid) {
        alert(
            "Password must contain:\n" +
            "- At least 8 characters\n" +
            "- At least one uppercase letter\n" +
            "- At least one lowercase letter\n" +
            "- At least one number\n" +
            "- At least one special character"
        );
        return;
    }

    const userData = {
        username,
        email,
        password,
        otp
    };

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.text();

        console.log(result);
        alert(result);

    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
    }
});
