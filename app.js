const shiftForm = document.querySelector("form");
const shiftDate = document.querySelector("#shift-date");
const shiftInput = document.querySelector("#shift-input");
const shiftList = document.querySelector("#shift-list");
const addButton = document.querySelector("#add-button");

if (shiftForm && shiftDate && shiftInput && shiftList && addButton) {

  addButton.addEventListener("click", registerShift);
  loadShifts();
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
    return;
  }

  savedShifts.forEach((shift) => {
    shiftList.append(createShiftItem(shift));
  });
}

function registerShift() {
  const date = shiftDate.value;
  const label = shiftInput.value.trim();


    savedShifts.forEach((shift) => {
      shiftList.append(createShiftItem(shift));
    });
  }


  if (
    shiftList.children.length === 1 &&
    shiftList.firstElementChild.textContent.includes("登録したシフト")
  ) {
    shiftList.replaceChildren();
  }

    if (!date || !label || !time) {
      return;
    }

    const shift = {
      id: `${Date.now()}-${Math.random()}`,
      date,
      time,
      label,
    };


  const savedShifts = JSON.parse(localStorage.getItem("shifts") || "[]");
  savedShifts.push(shift);
  localStorage.setItem("shifts", JSON.stringify(savedShifts));
main

    const savedShifts = getSavedShifts();
    localStorage.setItem("shifts", JSON.stringify([...savedShifts, shift]));

    const [year, month] = date.split("-").map(Number);
    calendarMonth = new Date(year, month - 1, 1);


  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "削除";

  removeButton.addEventListener("click", () => {
    item.remove();
    removeSavedShift(shift.id);

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
