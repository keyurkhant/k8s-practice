import fs from "fs";

export const isValidCSV = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.trim().split("\n");

  if (lines.length < 2) {
    return false;
  }

  const numColumns = lines[0].split(",").length;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].split(",").length !== numColumns) {
      return false;
    }
  }
  return true;
};
