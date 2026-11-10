const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const timer = document.getElementById("timer");

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
            "http://localhost:5000/forgot-password/send-otp",
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

forgotPasswordForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const otp = document.getElementById("otp").value.trim();
    const newPassword = document.getElementById("newPassword").value;

    // Password validation
    const isValid =
        newPassword.length >= 8 &&
        /[A-Z]/.test(newPassword) &&
        /[a-z]/.test(newPassword) &&
        /[0-9]/.test(newPassword) &&
        /[^A-Za-z0-9]/.test(newPassword);

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

    try {
        const response = await fetch(
            "http://localhost:5000/forgot-password/reset-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                })
            }
        );

        const result = await response.text();

        alert(result);

        if (response.ok) {
            window.location.href = "login.html";
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
    }

});
