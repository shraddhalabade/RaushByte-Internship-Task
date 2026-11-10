const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "shraddhalabade7858@gmail.com",
        pass: "talb zyfl mtow prkr"
    }
});
async function sendTestEmail() {
    try {
        const info = await transporter.sendMail({
            from: "shraddhalabade7858@gmail.com",
            to: "shraddhalabade7858@gmail.com",
            subject: "Test Email from Node.js",
            text: "Congratulations! Your email setup is working."
        });

        console.log("Email sent successfully!");
        console.log(info.response);

    } catch (err) {
        console.log(err);
    }
}
sendTestEmail();