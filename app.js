const shiftForm = document.querySelector("form");
const shiftDate = document.querySelector("#shift-date");
const shiftInput = document.querySelector("#shift-input");
const shiftList = document.querySelector("#shift-list");
const addButton = document.querySelector("#add-button");

const calendarSection = document.querySelector("#calendar-section");
const dailyShiftChart = document.querySelector("#daily-shift-chart");
const messageLink = document.querySelector("#message-link");

if (shiftForm && shiftDate && shiftInput && shiftList && addButton) {
  shiftForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerShift();
  });

  if (addButton.type !== "submit") {
    addButton.addEventListener("click", registerShift);
  }

  loadShifts();
  initializeOptionalComponents();
}

function initializeOptionalComponents() {
  if (messageLink && !messageLink.getAttribute("href")) {
    messageLink.setAttribute("href", "#");
  }

  updateDailyShiftChart();
}

function loadShifts() {
  let savedShifts;

  try {
    savedShifts = JSON.parse(localStorage.getItem("shifts") || "[]");
  } catch {
    savedShifts = [];
  }

  shiftList.replaceChildren();

  if (savedShifts.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "登録したシフトがここに並びます。";
    shiftList.append(emptyItem);
    updateDailyShiftChart();
    return;
  }

  savedShifts.forEach((shift) => {
    shiftList.append(createShiftItem(shift));
  });

  updateDailyShiftChart();
}

function registerShift() {
  const date = shiftDate.value;
  const label = shiftInput.value.trim();

  if (!date || !label) {
    return;
  }

  if (
    shiftList.children.length === 1 &&
    shiftList.firstElementChild &&
    shiftList.firstElementChild.textContent.includes("登録したシフト")
  ) {
    shiftList.replaceChildren();
  }

  const shift = {
    id: `${Date.now()}-${Math.random()}`,
    date,
    label,
  };

  shiftList.append(createShiftItem(shift));

  const savedShifts = JSON.parse(localStorage.getItem("shifts") || "[]");
  localStorage.setItem("shifts", JSON.stringify([...savedShifts, shift]));

  shiftInput.value = "";

  updateDailyShiftChart();
}

function createShiftItem(shift) {
  const item = document.createElement("li");
  item.textContent = `${shift.date}: ${shift.label}`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "削除";
  removeButton.addEventListener("click", () => {
    item.remove();
    removeSavedShift(shift.id);
    updateDailyShiftChart();

    if (shiftList.children.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.textContent = "登録したシフトがここに並びます。";
      shiftList.append(emptyItem);
    }
  });

  item.append(" ", removeButton);
  return item;
}

function removeSavedShift(id) {
  const savedShifts = JSON.parse(localStorage.getItem("shifts") || "[]");
  const remainingShifts = savedShifts.filter((shift) => shift.id !== id);
  localStorage.setItem("shifts", JSON.stringify(remainingShifts));
}

function updateDailyShiftChart() {
  if (!dailyShiftChart) {
    return;
  }

  let savedShifts;

  try {
    savedShifts = JSON.parse(localStorage.getItem("shifts") || "[]");
  } catch {
    savedShifts = [];
  }

  const countsByDate = {};

  savedShifts.forEach((shift) => {
    countsByDate[shift.date] = (countsByDate[shift.date] || 0) + 1;
  });

  dailyShiftChart.replaceChildren();

  const dates = Object.keys(countsByDate);

  if (dates.length === 0) {
    dailyShiftChart.textContent = "シフトデータがありません。";
    return;
  }

  dates.sort().forEach((date) => {
    const row = document.createElement("div");
    row.textContent = `${date} (${countsByDate[date]}件)`;
    dailyShiftChart.append(row);
  });
}