import React from 'react'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TaskImport = ({ data }) => {

    // console.log(data)
    const parsedData = data?.users.map((userString) => JSON.parse(userString));
    
    const fileName = `${data.companyName}.xlsx`
    // const handleExport = () => {
    //     // Step 1: Convert JSON data to worksheet
    //     const worksheet = XLSX.utils.json_to_sheet(parsedData);

    //     // Step 2: Create a new workbook and append the worksheet
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    //     // Step 3: Generate a buffer and save it
    //     const excelBuffer = XLSX.write(workbook, {
    //         bookType: "xlsx",
    //         type: "array",
    //     });

    //     // Step 4: Create a Blob from the buffer
    //     // const fileBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    //     const fileBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
    //     saveAs(fileBlob, fileName);
    // };

    const handleExport = () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(parsedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
    
            const fileBlob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
    
            const link = document.createElement("a");
            link.href = URL.createObjectURL(fileBlob);
            link.download = fileName;
    
            // Append the link to the body and trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Download failed. Please try again.");
        }
    };
    

    return (
        <li
            className="flex justify-between items-center  "
        >


            <p>{data?.companyName}</p>
            <button
            onClick={handleExport}
                className="bg-gradient-to-r from-black to-[#7d5126] text-xs px-4 py-2 rounded-md"
            >
                Import Data
            </button>
        </li>
    )
}

export default TaskImport
