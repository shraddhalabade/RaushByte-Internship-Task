const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const nodemailer = require("nodemailer");
const otpStore = {};

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "shraddhalabade7858@gmail.com",
        pass: "talb zyfl mtow prkr"
    }
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shraddha@BL21",
    database: "login_system"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
    } else {
        console.log("Connected to MySQL");
    }
});

app.use(express.static(__dirname));

app.use(
    "/dashboard",
    express.static(path.join(__dirname, "../dashboard"))
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.get("/test", (req, res) => {
    res.send("Test route is working");
});

app.post("/send-otp", async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).send("Email is required");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
    otp: otp,
    expiresAt: Date.now() + 1 * 60 * 1000
};
    try {

        await transporter.sendMail({
            from: "shraddhalabade7858@gmail.com",
            to: email,
            subject: "Email Verification OTP",
            text: `Your OTP is: ${otp}`
        });

        res.send("OTP Sent Successfully");

    } catch (err) {

        console.log(err);
        res.status(500).send("Failed to send OTP");

    }

});

app.post("/forgot-password/send-otp", (req, res) => {

    const { email } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).send("Database Error");
        }

        if (result.length === 0) {
            return res.status(404).send("Email not registered.");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 1 * 60 * 1000
        };

        try {

            await transporter.sendMail({
                from: "shraddhalabade7858@gmail.com",
                to: email,
                subject: "Password Reset OTP",
                text: `Your OTP is: ${otp}`
            });

            res.send("OTP Sent Successfully");

        } catch (err) {

            console.log(err);

            res.status(500).send("Failed to send OTP");

        }

    });

});

app.post("/forgot-password/reset-password", (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!otpStore[email]) {
        return res.status(400).send("Please send OTP first.");
    }

    if (Date.now() > otpStore[email].expiresAt) {
        delete otpStore[email];
        return res.status(400).send("OTP has expired.");
    }

    if (otpStore[email].otp !== otp) {
        return res.status(400).send("Invalid OTP.");
    }

    delete otpStore[email];

    const sql =
        "UPDATE users SET password = ? WHERE email = ?";

    db.query(sql, [newPassword, email], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database Error");
        }

        res.send("Password Updated Successfully");

    });

});

// SIGNUP 
app.post("/signup", (req, res) => {

    const { username, email, password, otp } = req.body;

    if (!otpStore[email]) {
    return res.status(400).send("Please send OTP first.");
}

if (Date.now() > otpStore[email].expiresAt) {
    delete otpStore[email];
    return res.status(400).send("OTP has expired. Please request a new OTP.");
}

if (otpStore[email].otp !== otp) {
    return res.status(400).send("Invalid OTP.");
}

    delete otpStore[email];

    const sql =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    db.query(sql, [username, email, password], (err, result) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).send("Email already exists");
            }

            console.log(err);
            return res.status(500).send("Database Error");
        }

        res.send("User Registered Successfully");
    });

});

// LOGIN 
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            return res.status(500).send("Database Error");
        }

        if (result.length > 0) {
            res.send("Login Successful");
        } else {
            res.status(401).send("Invalid Email or Password");
        }
    });
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    const { exec } = require("child_process");

   exec(`start http://localhost:${PORT}/login.html`);
});
