import * as XLSX from "xlsx";

/**
 * Generic utility to export a JSON array to an Excel file.
 * @param data Array of objects representing rows.
 * @param filename Name of the file without extension (e.g., "company-admin-course-report").
 */
export function exportToExcel(
  data: Record<string, unknown>[],
  filename: string,
) {
  if (!data || data.length === 0) {
    console.warn("No data available to export.");
    return;
  }

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");

  // Write the file (browser will trigger a download)
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
