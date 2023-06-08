var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth();
var selectedYear = currentYear;
var selectedMonth = currentMonth;
var selectedDay = currentDate.getDate();

function initializeCalendar() {
    generateCalendar(selectedYear, selectedMonth);
}

function generateCalendar(year, month) {
    var startDate = new Date(year, month, 1);
    var endDate = new Date(year, month + 1, 0);
    var calendarBody = document.querySelector("#calendar tbody");
    calendarBody.innerHTML = "";

    var row = document.createElement("tr");
    var dayOfWeek = startDate.getDay();

    // Add empty cells for previous month
    for (var i = 0; i < dayOfWeek; i++) {
        var emptyCell = document.createElement("td");
        row.appendChild(emptyCell);
    }

    // Generate cells for current month
    while (startDate <= endDate) {
        if (dayOfWeek === 7) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
            dayOfWeek = 0;
        }

        var cell = document.createElement("td");
        var date = startDate.getDate();

        cell.textContent = date;
        cell.addEventListener("click", function() {
            var clickedDate = parseInt(this.textContent);
            openNoteModal(year, month, clickedDate);
        });

        if (
            month === selectedMonth &&
            year === selectedYear &&
            date === selectedDay
        ) {
            cell.classList.add("today");
        } else {
            cell.classList.remove("today");
        }

        var note = getNoteFromStorage(year, month, date);
        if (note) {
            var noteIndicator = document.createElement("span");
            noteIndicator.classList.add("note-indicator");
            cell.appendChild(noteIndicator);
        }

        row.appendChild(cell);

        startDate.setDate(date + 1);
        dayOfWeek++;
    }

    // Add empty cells for remaining days
    while (dayOfWeek < 7) {
        var emptyCell = document.createElement("td");
        row.appendChild(emptyCell);
        dayOfWeek++;
    }

    calendarBody.appendChild(row);

    var monthYearElement = document.getElementById("month-year");
    monthYearElement.textContent = getMonthYearString(year, month);
}

function openNoteModal(year, month, day) {
    var modal = document.getElementById("note-modal");
    var noteModalDate = document.getElementById("note-modal-date");
    var noteModalText = document.getElementById("note-modal-text");
    var noteModalSave = document.getElementById("note-modal-save");
    var closeBtn = document.getElementsByClassName("close")[0];

    noteModalDate.textContent = getFormattedDate(year, month, day);

    var storedNote = getNoteFromStorage(year, month, day);
    noteModalText.value = storedNote ? storedNote : "";

    modal.style.display = "block";

    noteModalSave.onclick = function() {
        var note = noteModalText.value;
        saveNoteToStorage(year, month, day, note);
        modal.style.display = "none";
        generateCalendar(year, month); // Refresh the calendar after saving the note
    };

    closeBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function getFormattedDate(year, month, day) {
    var date = new Date(year, month, day);
    var options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
}

function saveNoteToStorage(year, month, day, note) {
    var key = getStorageKey(year, month, day);
    localStorage.setItem(key, note);
}

function getNoteFromStorage(year, month, day) {
    var key = getStorageKey(year, month, day);
    return localStorage.getItem(key);
}

function getStorageKey(year, month, day) {
    return year + "-" + month + "-" + day;
}

function getMonthYearString(year, month) {
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return months[month] + " " + year;
}

function previousMonth() {
    selectedMonth--;
    if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear--;
    }
    generateCalendar(selectedYear, selectedMonth);
}

function nextMonth() {
    selectedMonth++;
    if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear++;
    }
    generateCalendar(selectedYear, selectedMonth);
}

initializeCalendar();
