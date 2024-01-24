import express, { json } from "express";
import axios from "axios";
import { createJSON } from "./utils/utils";
import { createArrayCsvWriter as csvWriter } from "csv-writer";

const app = express();
app.use(express.json());
const port = 6000;

const TEMP_SERVICE_API_URL = "http://temperature-service:6001/get-temperature-info";
// const TEMP_SERVICE_API_URL = "http://localhost:6001/get-temperature-info";

app.get("/", (req, res) => {
  res.send("Hello from Container 1!");
});

app.post("/store-file", (req, res) => {
  const { file, data } = req.body;

  if (!file || !data) {
    return res.status(400).json({
      file: null,
      error: "Invalid JSON input.",
    });
  }

  const filePath = `/Keyur_PV_dir/${file}`;

  const writer = csvWriter({
    path: filePath,
  });

  console.log(writer)
  writer
    .writeRecords(createJSON(data))
    .then(() => {
      res.status(200).json({
        file,
        message: "Success.",
      });
    })
    .catch((err) => {
      console.error("Error while storing the file:", err);
      res.status(500).json({
        file,
        error: "Error while storing the file to the storage.",
      });
    });
});

app.post("/get-temperature", async (req, res) => {
  console.log("Trying to call the 2nd container");
  const fileName = req.body.file;
  try {
    const response = await axios.post(TEMP_SERVICE_API_URL, {
      file: req.body.file,
      name: req.body.name,
    });

    const data = response.data;    
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error("Error calling the 2nd container:", error);
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ file: fileName, error: error.response.data.error });
      } else if (error.response.status === 400) {
        return res.status(400).json({ file: fileName, error: error.response.data.error });
      }
    } else {
      return res.status(500).json({ file: fileName, error: "Internal server error." });
    }
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
