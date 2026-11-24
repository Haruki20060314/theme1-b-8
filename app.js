const shiftForm = document.querySelector("form");
const shiftDate = document.querySelector("#shift-date");
const shiftInput = document.querySelector("#shift-input");
const shiftList = document.querySelector("#shift-list");
const addButton = document.querySelector("#add-button");

if (shiftForm && shiftDate && shiftInput && shiftList && addButton) {
  shiftForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerShift();
  });

  if (addButton.type !== "submit") {
    addButton.addEventListener("click", registerShift);
  }

  loadShifts();
}

function loadShifts() {
  let savedShifts;

  try {
    savedShifts = JSON.parse(localStorage.getItem("shifts") || "[]");
  } catch {
    savedShifts = [];
  }

  if (savedShifts.length === 0) {
    return;
  }

  shiftList.replaceChildren();
  savedShifts.forEach((shift) => {
    shiftList.append(createShiftItem(shift));
  });
}

function registerShift() {
  const date = shiftDate.value;
  const label = shiftInput.value.trim();

  if (!date || !label) {
    return;
  }

  if (
    shiftList.children.length === 1
    && shiftList.firstElementChild.textContent.includes("登録したシフト")
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
  });

  item.append(" ", removeButton);
  return item;
}

function removeSavedShift(id) {
  const savedShifts = JSON.parse(localStorage.getItem("shifts") || "[]");
  const remainingShifts = savedShifts.filter((shift) => shift.id !== id);
  localStorage.setItem("shifts", JSON.stringify(remainingShifts));
}
