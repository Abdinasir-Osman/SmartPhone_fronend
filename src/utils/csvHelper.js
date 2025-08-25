// src/utils/csvHelper.js

export function convertToCSV(data) {
  if (!data || data.length === 0) return "";

  const keys = Object.keys(data[0]);
  const header = keys.join(",");

  const values = data
    .map(row =>
      keys.map(key => {
        const value = row[key];
        if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        }
        return `"${value}"`;
      }).join(",")
    )
    .join("\n");

  return `${header}\n${values}`;
}

export function downloadCSV(csvContent, filename = "export.csv") {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.click();
}
