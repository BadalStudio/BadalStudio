// ========================================
// BRIGHTPATH ACADEMY
// Website interactions
// ========================================


// 1. SELECT HTML ELEMENTS

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const enquiryForm = document.getElementById("enquiryForm");
const formMessage = document.getElementById("formMessage");

const studentName = document.getElementById("studentName");
const studentClass = document.getElementById("studentClass");
const studentPhone = document.getElementById("studentPhone");
const studentSubject = document.getElementById("studentSubject");
const studentMessage = document.getElementById("studentMessage");

const currentYear = document.getElementById("currentYear");


// 2. UPDATE FOOTER YEAR

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// 3. MOBILE NAVIGATION MENU

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });


    // Close menu after clicking a navigation link

    const navigationItems = navLinks.querySelectorAll("a");

    navigationItems.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.textContent = "☰";

        });

    });

}


// 4. COURSE ENQUIRY BUTTONS

const courseLinks = document.querySelectorAll("[data-course]");

courseLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        const selectedCourse = link.dataset.course;

        if (studentSubject) {
            studentSubject.value = selectedCourse;
        }

    });

});


// 5. HELPER: SHOW FORM MESSAGE

function showFormMessage(message, isError) {

    if (!formMessage) {
        return;
    }

    formMessage.textContent = message;

    formMessage.style.color = isError ? "#c0392b" : "#16834b";

}


// 6. ENQUIRY FORM VALIDATION

if (enquiryForm) {

    enquiryForm.addEventListener("submit", function (event) {

        // Stop the browser from submitting to a server.

        event.preventDefault();


        // Read and clean the entered information.

        const name = studentName.value.trim();

        const className = studentClass.value;

        const phone = studentPhone.value.trim();

        const subject = studentSubject.value;

        const message = studentMessage.value.trim();


        // Check required information.

        if (!name || !className || !phone || !subject) {

            showFormMessage(
                "Please complete all required fields.",
                true
            );

            return;

        }


        // Basic phone-number format check.
        // Allows international prefixes and common separators.

        const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

        if (!phonePattern.test(phone)) {

            showFormMessage(
                "Please enter a valid phone number.",
                true
            );

            studentPhone.focus();

            return;

        }


        // Prepare the enquiry text.

        const enquiryText =
`BRIGHTPATH ACADEMY — ENQUIRY

Name: ${name}
Class: ${className}
Phone: ${phone}
Subject: ${subject}
Message: ${message || "No additional message"}

Note: This enquiry was prepared using the demo website.`;


        // Display a success message.

        showFormMessage(
            "Your enquiry is ready. You can copy it below.",
            false
        );


        // Create or update a visible enquiry preview.

        let preview = document.getElementById("enquiryPreview");

        if (!preview) {

            preview = document.createElement("div");

            preview.id = "enquiryPreview";

            preview.style.marginTop = "16px";
            preview.style.padding = "16px";
            preview.style.border = "1px solid #dce5f0";
            preview.style.borderRadius = "12px";
            preview.style.background = "#f5f8fc";

            const previewTitle = document.createElement("h4");

            previewTitle.textContent = "Your prepared enquiry";

            previewTitle.style.marginBottom = "10px";
            previewTitle.style.color = "#102744";

            const previewText = document.createElement("pre");

            previewText.id = "enquiryPreviewText";
            previewText.style.whiteSpace = "pre-wrap";
            previewText.style.overflowWrap = "anywhere";
            previewText.style.fontFamily = "Arial, sans-serif";
            previewText.style.fontSize = "12px";
            previewText.style.lineHeight = "1.7";
            previewText.style.color = "#243954";

            const copyButton = document.createElement("button");

            copyButton.type = "button";
            copyButton.className = "btn";
            copyButton.textContent = "Copy Enquiry";
            copyButton.style.marginTop = "12px";

            copyButton.addEventListener("click", async function () {

                try {

                    await navigator.clipboard.writeText(
                        previewText.textContent
                    );

                    showFormMessage(
                        "Enquiry copied! You can now share it yourself.",
                        false
                    );

                } catch (error) {

                    showFormMessage(
                        "Copy was unavailable. Please select and copy the enquiry text manually.",
                        true
                    );

                }

            });


            preview.appendChild(previewTitle);
            preview.appendChild(previewText);
            preview.appendChild(copyButton);

            enquiryForm.appendChild(preview);

        }


        document.getElementById("enquiryPreviewText").textContent =
            enquiryText;


        // Show the prepared enquiry to the user.

        preview.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });

}


// 7. BASIC CONSOLE CHECK

console.log("BrightPath Academy JavaScript loaded successfully.");
