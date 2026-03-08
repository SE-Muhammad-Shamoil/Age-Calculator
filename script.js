let inp = document.getElementById("date");
let result = document.getElementById("result");

// Set max date to today to prevent future date selection
inp.max = new Date().toISOString().split("T")[0];

function calculateAge() {
    let birthDate = new Date(inp.value);
    
    if (isNaN(birthDate)) {
        result.innerHTML = "Please enter a valid date.";
        return;
    }

    let today = new Date();
    
    if (birthDate > today) {
        result.innerHTML = "Birth date cannot be in the future.";
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

    result.innerHTML = `You are <span>${y3}</span> years, <span>${m3}</span> months and <span>${d3}</span> days old.`;
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}