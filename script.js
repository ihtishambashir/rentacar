/* ========================================
   VERTEXRENT - MAIN JAVASCRIPT
======================================== */


/* ========================================
   MOBILE NAVIGATION
======================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    // Close menu when navigation link is clicked

    const navLinks = mainNav.querySelectorAll("a");

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* ========================================
   DATE VALIDATION
======================================== */

const dateFrom = document.getElementById("date-from");
const dateTo = document.getElementById("date-to");


if (dateFrom && dateTo) {

    // Today's date

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const todayString =
        `${year}-${month}-${day}`;


    // Prevent selecting past dates

    dateFrom.min = todayString;

    dateTo.min = todayString;


    // Date From changes

    dateFrom.addEventListener("change", () => {

        dateTo.min = dateFrom.value;

        if (
            dateTo.value &&
            dateTo.value < dateFrom.value
        ) {

            dateTo.value = "";

        }

    });

}


/* ========================================
   CONTACT FORM DATE VALIDATION
======================================== */

const contactDateFrom =
    document.getElementById(
        "contact-date-from"
    );

const contactDateTo =
    document.getElementById(
        "contact-date-to"
    );


if (contactDateFrom && contactDateTo) {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const todayString =
        `${year}-${month}-${day}`;


    contactDateFrom.min =
        todayString;

    contactDateTo.min =
        todayString;


    contactDateFrom.addEventListener(
        "change",
        () => {

            contactDateTo.min =
                contactDateFrom.value;

            if (
                contactDateTo.value &&
                contactDateTo.value <
                contactDateFrom.value
            ) {

                contactDateTo.value = "";

            }

        }
    );

}


/* ========================================
   FORM SUBMISSION - VERCEL API
======================================== */

async function submitToContactApi(form, endpoint) {
    const status = form.querySelector(".service-form-status") || form.querySelector(".form-note");
    const button = form.querySelector("button[type=submit]");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (status) {
        status.textContent = "Sending…";
        status.classList.remove("is-success", "is-error");
    }
    if (button) button.disabled = true;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.message || "The request could not be sent.");
        }

        if (status) {
            status.textContent = result.message || "Thank you. Your request has been sent.";
            status.classList.add("is-success");
        }
        form.reset();
        return true;
    } catch (error) {
        if (status) {
            status.textContent = error.message || "Something went wrong. Please try again.";
            status.classList.add("is-error");
        } else {
            alert(error.message || "Something went wrong. Please try again.");
        }
        return false;
    } finally {
        if (button) button.disabled = false;
    }
}

const bookingForm = document.getElementById("bookingForm");
const bookingService = document.getElementById("service");
const bookingVehicleGroup = document.getElementById("bookingVehicleGroup");
const bookingVehicle = document.getElementById("vehicle");

function updateBookingServiceFields() {
    if (!bookingService || !bookingVehicleGroup || !bookingVehicle) return;

    const isRental = bookingService.value === "rental-car";

    // Vehicle selection belongs only to Rental Cars.
    bookingVehicleGroup.hidden = !isRental;
    bookingVehicle.disabled = !isRental;
    bookingVehicle.required = isRental;

    if (!isRental) {
        bookingVehicle.value = "";
    } else if (!bookingVehicle.value) {
        bookingVehicle.value = "available-rental-vehicle";
    }
}

if (bookingService) {
    bookingService.addEventListener("change", updateBookingServiceFields);
    updateBookingServiceFields();
}

if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitToContactApi(bookingForm, "/api/booking");
    });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitToContactApi(contactForm, "/api/contact");
    });
}

const serviceForms = document.querySelectorAll("[data-service-form]");
serviceForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const endpoint = form.dataset.serviceForm === "moving" ? "/api/moving" : "/api/rental";
        submitToContactApi(form, endpoint);
    });
});


/* ========================================
   SERVICE FORM DATE VALIDATION
======================================== */

const minToday = new Date().toISOString().split("T")[0];

const rentalFrom = document.getElementById("rental-date-from");
const rentalTo = document.getElementById("rental-date-to");
if (rentalFrom && rentalTo) {
    rentalFrom.min = minToday;
    rentalTo.min = minToday;
    rentalFrom.addEventListener("change", () => {
        rentalTo.min = rentalFrom.value;
        if (rentalTo.value && rentalTo.value < rentalFrom.value) rentalTo.value = "";
    });
}

const movingDate = document.getElementById("moving-date");
if (movingDate) movingDate.min = minToday;

/* ========================================
   CURRENT YEAR
======================================== */

const yearElements =
    document.querySelectorAll(
        ".current-year"
    );


yearElements.forEach((element) => {

    element.textContent =
        new Date().getFullYear();

});


/* ========================================
   HEADER SHADOW ON SCROLL
======================================== */

const header =
    document.querySelector(
        ".site-header"
    );


if (header) {

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 20) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        }
    );

}