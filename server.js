import express from "express";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const app = express();
const __dirname = path.resolve();
const dataFile = path.join(__dirname, "data", "name.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile));
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.get("/guests", (req, res) => {
  const guests = readData();
  res.json(guests);
});

app.post("/guests", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Namn saknas" });
  }

  const guests = readData();
  const newGuest = { id: uuidv4(), name };
  guests.push(newGuest);
  writeData(guests);

  console.log("Ny gäst tillagd:", newGuest);

  res.json({ message: `Gäst ${name} tillagd` });
});

app.put("/guests/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  const guests = readData();
  const guest = guests.find(g => g.id === id);

  if (!guest) {
    return res.status(404).json({ message: "Gäst hittades inte" });
  }

  guest.name = name;
  writeData(guests);

  console.log("Uppdaterad gäst:", guest);

  res.json({ message: "Gäst uppdaterad" });
});

app.delete("/guests/:id", (req, res) => {
  const id = req.params.id;
  const guests = readData();
  const filteredGuests = guests.filter(g => g.id !== id);

  if (filteredGuests.length === guests.length) {
    return res.status(404).json({ message: "Gäst hittades inte" });
  }

  writeData(filteredGuests);
  console.log("Gäst borttagen:", id);

  res.json({ message: "Gäst borttagen" });
});


app.listen(3000, () => {
  console.log("Servern kör på port 3000");
});