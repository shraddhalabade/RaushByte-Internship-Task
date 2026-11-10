
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

// Mobile navbar
menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "☰";
    });
});

// Contact form

const contactForm = document.getElementById("contactForm");

emailjs.init({
    publicKey: "pB5AhqNSViBfZcsS_"
});

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Sending...";

    try {
        await emailjs.send(
            "service_52zsphr",
            "template_jt9nqhj",
            {
                name: name,
                email: email,
                subject: subject,
                message: message
            }
        );

        alert("Your inquiry was sent successfully!");
        contactForm.reset();
    } catch (error) {
        console.error("EmailJS error:", error);
        alert("Unable to send your inquiry. Please try again.");
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
});
