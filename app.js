const shiftForm = document.querySelector("form");
const shiftDate = document.querySelector("#shift-date");
const shiftInput = document.querySelector("#shift-input");
const shiftList = document.querySelector("#shift-list");
const addButton = document.querySelector("#add-button");

if (shiftForm && shiftDate && shiftInput && shiftList && addButton) {
  // 時間入力欄がなければ作成
  let shiftTime = document.querySelector("#shift-time");
  if (!shiftTime) {
    const timeLabel = document.createElement("label");
    timeLabel.htmlFor = "shift-time";
    timeLabel.textContent = "時間 ";
    shiftTime = document.createElement("input");
    shiftTime.id = "shift-time";
    shiftTime.type = "time";
    timeLabel.append(shiftTime);
    shiftInput.insertAdjacentElement("afterend", timeLabel);
  }

  // カレンダー表示欄がなければ作成
  let calendar = document.querySelector("#calendar");
  if (!calendar) {
    calendar = document.createElement("section");
    calendar.id = "calendar";
    shiftList.insertAdjacentElement("afterend", calendar);
  }

  let calendarMonth = new Date();
  calendarMonth.setDate(1);

  shiftForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerShift();
  });

  if (addButton.type !== "submit") {
    addButton.addEventListener("click", registerShift);
  }

  loadShifts();
  renderCalendar();

  function getSavedShifts() {
    try {
      return JSON.parse(localStorage.getItem("shifts") || "[]");
    } catch {
      return [];
    }
  }

  function loadShifts() {
    const savedShifts = getSavedShifts();
    shiftList.replaceChildren();

    savedShifts.forEach((shift) => {
      shiftList.append(createShiftItem(shift));
    });
  }

  function registerShift() {
    const date = shiftDate.value;
    const label = shiftInput.value.trim();
    const time = shiftTime.value;

    if (!date || !label || !time) {
      return;
    }

    const shift = {
      id: `${Date.now()}-${Math.random()}`,
      date,
      time,
      label,
    };

    shiftList.append(createShiftItem(shift));

    const savedShifts = getSavedShifts();
    localStorage.setItem("shifts", JSON.stringify([...savedShifts, shift]));

    const [year, month] = date.split("-").map(Number);
    calendarMonth = new Date(year, month - 1, 1);

    shiftInput.value = "";
    shiftTime.value = "";
    renderCalendar();
  }

  function createShiftItem(shift) {
    const item = document.createElement("li");
    item.append(
      document.createTextNode(
        `${shift.date} ${shift.time || "時間未設定"}: ${shift.label}`,
      ),
    );

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "削除";
    removeButton.addEventListener("click", () => {
      item.remove();
      removeSavedShift(shift.id);
      renderCalendar();
    });

    item.append(" ", removeButton);
    return item;
  }

  function removeSavedShift(id) {
    const remainingShifts = getSavedShifts().filter(
      (shift) => shift.id !== id,
    );
    localStorage.setItem("shifts", JSON.stringify(remainingShifts));
  }

  function renderCalendar() {
    calendar.replaceChildren();

    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const heading = document.createElement("h2");
    heading.textContent = `${year}年${month + 1}月`;

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.textContent = "前の月";
    previousButton.addEventListener("click", () => {
      calendarMonth.setMonth(calendarMonth.getMonth() - 1);
      renderCalendar();
    });

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.textContent = "次の月";
    nextButton.addEventListener("click", () => {
      calendarMonth.setMonth(calendarMonth.getMonth() + 1);
      renderCalendar();
    });

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(7, minmax(0, 1fr))";
    grid.style.gap = "6px";

    ["日", "月", "火", "水", "木", "金", "土"].forEach((day) => {
      const cell = document.createElement("strong");
      cell.textContent = day;
      grid.append(cell);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const savedShifts = getSavedShifts();

    for (let i = 0; i < firstDay; i++) {
      grid.append(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.style.border = "1px solid #ccc";
      cell.style.minHeight = "70px";
      cell.style.padding = "4px";
      cell.textContent = String(day);

      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      savedShifts
        .filter((shift) => shift.date === date)
        .forEach((shift) => {
          const entry = document.createElement("div");
          entry.textContent = `${shift.time || ""} ${shift.label}`;
          cell.append(entry);
        });

      grid.append(cell);
    }

    calendar.append(previousButton, heading, nextButton, grid);
  }
}