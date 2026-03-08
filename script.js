let errorMsg = document.getElementById("error-message");
let resSection = document.getElementById("result-section");

let resYears = document.getElementById("res-years");
let resMonths = document.getElementById("res-months");
let resDays = document.getElementById("res-days");

let selectedDateDisplay = document.getElementById("selected-date-display");
let calendarDropdown = document.getElementById("calendar-dropdown");
let customDatePicker = document.getElementById("custom-date-picker");

let monthSelect = document.getElementById("month-select");
let yearSelect = document.getElementById("year-select");
let prevMonthBtn = document.getElementById("prev-month");
let nextMonthBtn = document.getElementById("next-month");
let calendarDays = document.getElementById("calendar-days");

let currentDate = new Date();
let chosenDate = null;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function initCalendar() {
    months.forEach((m, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.text = m;
        monthSelect.appendChild(option);
    });

    let currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 120; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        yearSelect.appendChild(option);
    }

    monthSelect.value = currentDate.getMonth();
    yearSelect.value = Math.min(currentYear, currentDate.getFullYear());

    renderCalendar();
}

function renderCalendar() {
    calendarDays.innerHTML = "";
    let month = parseInt(monthSelect.value);
    let year = parseInt(yearSelect.value);

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < firstDay; i++) {
        let emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty-day");
        calendarDays.appendChild(emptyDiv);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let dayDiv = document.createElement("div");
        dayDiv.classList.add("cal-day");
        dayDiv.innerText = i;
        
        let thisDate = new Date(year, month, i);
        if (thisDate > today) {
            dayDiv.classList.add("disabled");
        } else {
            dayDiv.addEventListener("click", () => {
                chosenDate = new Date(year, month, i);
                selectedDateDisplay.innerText = `${months[month]} ${i}, ${year}`;
                selectedDateDisplay.classList.add("has-value");
                calendarDropdown.classList.remove("show");
                renderCalendar(); 
            });

            if (chosenDate && chosenDate.getDate() === i && chosenDate.getMonth() === month && chosenDate.getFullYear() === year) {
                dayDiv.classList.add("selected");
            }
        }
        calendarDays.appendChild(dayDiv);
    }
}

// Calendar Events
selectedDateDisplay.addEventListener("click", (e) => {
    calendarDropdown.classList.toggle("show");
    e.stopPropagation();
});

monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);

prevMonthBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let month = parseInt(monthSelect.value);
    let year = parseInt(yearSelect.value);
    if (month === 0) {
        monthSelect.value = 11;
        yearSelect.value = year - 1;
    } else {
        monthSelect.value = month - 1;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let month = parseInt(monthSelect.value);
    let year = parseInt(yearSelect.value);
    
    // Prevent navigating to future given restrictions
    let today = new Date();
    if (year === today.getFullYear() && month >= today.getMonth()) return;

    if (month === 11) {
        monthSelect.value = 0;
        yearSelect.value = year + 1;
    } else {
        monthSelect.value = month + 1;
    }
    renderCalendar();
});

document.addEventListener("click", (e) => {
    if (!customDatePicker.contains(e.target)) {
        calendarDropdown.classList.remove("show");
    }
});

// Initialize logic
initCalendar();

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.classList.add("show");
    resSection.classList.remove("active");
    resYears.innerText = "-";
    resMonths.innerText = "-";
    resDays.innerText = "-";
}

function calculateAge() {
    errorMsg.classList.remove("show");

    if (!chosenDate) {
        showError("Please select your birth date.");
        return;
    }
    
    let birthDate = chosenDate;
    let today = new Date();
    
    if (birthDate > today) {
        showError("Birth date cannot be in the future.");
        return;
    }

    let d1 = birthDate.getDate();
    let m1 = birthDate.getMonth() + 1;
    let y1 = birthDate.getFullYear();

    let d2 = today.getDate();
    let m2 = today.getMonth() + 1;
    let y2 = today.getFullYear();

    let d3, m3, y3;

    y3 = y2 - y1;

    if (m2 >= m1) {
        m3 = m2 - m1;
    } else {
        y3--;
        m3 = 12 + m2 - m1;
    }

    if (d2 >= d1) {
        d3 = d2 - d1;
    } else {
        m3--;
        d3 = getDaysInMonth(y1, m1) + d2 - d1;
    }

    if (m3 < 0) {
        m3 = 11;
        y3--;
    }

    resSection.classList.add("active");
    
    animateValue(resYears, 0, y3, 1200);
    animateValue(resMonths, 0, m3, 1200);
    animateValue(resDays, 0, d3, 1200);
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        obj.innerHTML = Math.floor(easeOut * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end; 
        }
    };
    window.requestAnimationFrame(step);
}