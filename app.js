const storageKey = "shift-talk-shifts";
const calendarGrid = document.querySelector("#calendar-grid");
const monthLabel = document.querySelector("#month-label");
const shiftForm = document.querySelector("#shift-form");
const shiftDateInput = document.querySelector("#shift-date");
const shiftInput = document.querySelector("#shift-input");
const shiftList = document.querySelector("#shift-list");
const feedback = document.querySelector("#form-feedback");
const today = new Date();
let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let shifts = loadShifts();

function loadShifts() {
  try {
    const savedShifts = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(savedShifts)) return [];

    return savedShifts.filter((shift) =>
      shift && typeof shift.id === "string" && typeof shift.date === "string" && typeof shift.label === "string"
    );
  } catch {
    return [];
  }
}

function saveShifts() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(shifts));
    return true;
  } catch {
    return false;
  }
}

function formatDate(date, options) {
  return date.toLocaleDateString("ja-JP", options);
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const shiftsByDate = new Map();

  for (const shift of shifts) {
    const dayShifts = shiftsByDate.get(shift.date) || [];
    dayShifts.push(shift);
    shiftsByDate.set(shift.date, dayShifts);
  }

  monthLabel.textContent = formatDate(displayedMonth, { year: "numeric", month: "long" });
  calendarGrid.replaceChildren();

  for (const weekday of ["月", "火", "水", "木", "金", "土", "日"]) {
    const heading = document.createElement("span");
    heading.className = "weekday";
    heading.textContent = weekday;
    calendarGrid.append(heading);
  }

  for (let index = 0; index < firstWeekday; index += 1) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day calendar-day-empty";
    emptyDay.setAttribute("aria-hidden", "true");
    calendarGrid.append(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    dayCell.setAttribute("aria-label", formatDate(date, { month: "long", day: "numeric", weekday: "long" }));

    if (dateKey === today.toLocaleDateString("sv-SE")) {
      dayCell.classList.add("is-today");
    }

    const dayNumber = document.createElement("span");
    dayNumber.className = "day-number";
    dayNumber.textContent = String(day);
    dayCell.append(dayNumber);

    for (const shift of shiftsByDate.get(dateKey) || []) {
      const shiftLabel = document.createElement("span");
      shiftLabel.className = "calendar-shift";
      shiftLabel.textContent = shift.label;
      dayCell.append(shiftLabel);
    }

    calendarGrid.append(dayCell);
  }
}

function renderShiftList() {
  shiftList.replaceChildren();
  const sortedShifts = [...shifts].sort((first, second) => first.date.localeCompare(second.date));

  if (sortedShifts.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "シフトはまだ登録されていません。";
    shiftList.append(emptyMessage);
    return;
  }

  for (const shift of sortedShifts) {
    const item = document.createElement("li");
    item.className = "shift-item";

    const date = new Date(`${shift.date}T00:00:00`);
    const dateLabel = document.createElement("time");
    dateLabel.dateTime = shift.date;
    dateLabel.className = "shift-item-date";
    dateLabel.textContent = formatDate(date, { month: "numeric", day: "numeric", weekday: "short" });

    const shiftLabel = document.createElement("span");
    shiftLabel.className = "shift-item-label";
    shiftLabel.textContent = shift.label;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "削除";
    removeButton.setAttribute("aria-label", `${dateLabel.textContent} ${shift.label}を削除`);
    removeButton.addEventListener("click", () => {
      shifts = shifts.filter((savedShift) => savedShift.id !== shift.id);
      saveShifts();
      render();
      feedback.textContent = "シフトを削除しました。";
    });

    item.append(dateLabel, shiftLabel, removeButton);
    shiftList.append(item);
  }
}

function render() {
  renderCalendar();
  renderShiftList();
}

document.querySelector("#today-label").textContent = formatDate(today, {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});
shiftDateInput.value = today.toLocaleDateString("sv-SE");

document.querySelector("#previous-month").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
  renderCalendar();
});

document.querySelector("#next-month").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
  renderCalendar();
});

shiftForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const label = shiftInput.value.trim();

  if (!shiftDateInput.value || !label) {
    feedback.textContent = "勤務日とシフト内容を入力してください。";
    return;
  }

  shifts.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: shiftDateInput.value,
    label,
  });

  const saved = saveShifts();
  displayedMonth = new Date(`${shiftDateInput.value}T00:00:00`);
  shiftInput.value = "";
  render();
  feedback.textContent = saved
    ? "シフトを登録しました。"
    : "シフトは表示されましたが、このブラウザーには保存できませんでした。";
  shiftInput.focus();
});

render();