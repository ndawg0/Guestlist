const guestListEl = document.getElementById("guest-list");
const addBtn = document.getElementById("add-btn");
const guestNameInput = document.getElementById("guest-name");

const apiUrl = "/guests"; 

async function loadGuests() {
  guestListEl.innerHTML = "";
  const res = await fetch(apiUrl);
  const guests = await res.json();

  if (guests.length === 0) { 
    guestListEl.innerHTML = "<li>Ingen gäst ännu</li>";
    return;
  } 

  guests.forEach((guest) => { 
    const li = document.createElement("li");
    li.textContent = guest.name + " ";

    const editBtn = document.createElement("button"); 
    editBtn.textContent = "Ändra";
    editBtn.onclick = () => startEdit(guest.id, guest.name, li);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Ta bort";
    delBtn.onclick = () => deleteGuest(guest.id);

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    guestListEl.appendChild(li);
  });
}

function startEdit(id, oldName, li) {
  li.innerHTML = "";

  const input = document.createElement("input");
  input.value = oldName;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Spara";
  saveBtn.onclick = async () => {
    const newName = input.value.trim();
    if (newName) {
      await updateGuest(id, newName);
    }
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Avbryt";
  cancelBtn.onclick = loadGuests;

  li.appendChild(input);
  li.appendChild(saveBtn);
  li.appendChild(cancelBtn);
}

addBtn.onclick = async () => {
  const name = guestNameInput.value.trim();
  if (!name) {
    alert("Skriv in ett namn!");
    return;
  }

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  guestNameInput.value = "";
  loadGuests();
};

async function deleteGuest(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  loadGuests();
}

async function updateGuest(id, newName) {
  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName }),
  });
  loadGuests();
}

document.addEventListener("DOMContentLoaded", loadGuests);