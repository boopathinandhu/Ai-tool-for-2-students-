const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.join(__dirname, "registrations.json");

// Create file if not exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Registration API
app.post("/register", (req, res) => {
  try {
    const { name, school, medium, phone, group, district, message } = req.body;

    if (!name || !school || !medium || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const existingData = JSON.parse(fs.readFileSync(dataFile, "utf8"));

    const newRegistration = {
      id: Date.now(),
      name,
      school,
      medium,
      phone,
      group: group || "",
      district: district || "",
      message: message || "",
      createdAt: new Date().toISOString()
    };

    existingData.push(newRegistration);
    fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));

    res.json({
      success: true,
      message: "Registration successful! We will contact you soon."
    });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
});

// View all registrations
app.get("/registrations", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Unable to read registrations." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});