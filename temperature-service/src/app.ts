import express from "express";
import fs from "fs";
import csv from "csv-parser";
import { isValidCSV } from "./utils/utils";

const app = express();
app.use(express.json());
const port = 6001;

app.get("/", (req, res) => {
  res.send("Hello from Container 2!");
});

app.post("/get-temperature-info", (req, res) => {
  const { file, name } = req.body;
  const filePath = `../Keyur_PV_dir/${file}`;
  const data = [];

  // Check if 'file' exists in the request body
  if (!file) {
    return res.status(400).json({ file: null, error: "Invalid JSON input." });
  }

  // Check if the file exists in the specified path
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ file, error: "File not found." });
  }

  if (!isValidCSV(filePath)) {
    return res
      .status(404)
      .json({ file, error: "Input file not in CSV format." });
  }
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      data.push(row);
    })
    .on("end", () => {
      const userEntries = data.filter((entry) => entry.name === name);

      if (userEntries.length === 0) {
        return res.status(404).json({ file, error: "User not found." });
      }
      const latestEntry = userEntries[userEntries.length - 1];
      const temperature = parseInt(latestEntry.temperature);
      return res.status(200).json({ file, temperature });
    })
    .on("error", (error) => {
      console.error(error);
      res.status(500).json({ file, error: "Internal Server Error" });
    });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
