export const createJSON = (data: string) => {
  const rows = data.split("\n");
  const result = rows.map((row) => row.split(",").map((ele) => ele.trim()));
  return result;
};
