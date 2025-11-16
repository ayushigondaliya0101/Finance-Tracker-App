const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data.json");

// Helper: read JSON
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Helper: write JSON
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData
};

