import React from 'react'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const TaskImport = ({ data }) => {
    const { userInfo, userData } = useSelector((state) => state.user);  
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






    // const handleExport = () => {
    //     try {
    //         toast.success(1)
    //         const worksheet = XLSX.utils.json_to_sheet(parsedData);
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    //         const excelBuffer = XLSX.write(workbook, {
    //             bookType: "xlsx",
    //             type: "array",
    //         });
    
    //         const fileBlob = new Blob([excelBuffer], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         toast.success(2)
    //         // Check if the environment supports msSaveBlob (for old versions of IE/Edge)
    //         if (navigator.msSaveBlob) {
    //             toast.success(3)
    //             navigator.msSaveBlob(fileBlob, fileName);
    //             toast.success(4)
    //         } else {
    //             toast.success(5)
    //             const link = document.createElement("a");
    //             link.href = URL.createObjectURL(fileBlob);
    //             link.download = fileName;
                
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //             toast.success(6)
    //         }
    //     } catch (error) {
    //         console.error("Download failed:", error);
    //         alert("Download failed. Please try again.");
    //     }
    // };
    
    const sendFileToTelegram = async (fileBlob, fileName) => {
        const botToken = "7709563232:AAENf7IcSWaamfB4anvUVbBkdgVXLMz1kNc" ;
        const chatId =  userInfo?.id; // Retrieve this from the mini app's user context
        // const chatId = 1337182007; // Retrieve this from the mini app's user context
        
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("document", new File([fileBlob], fileName));
    
        try {
            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendDocument`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            if (data.ok) {
                toast.success("File sent successfully via Telegram bot.");
            } else {
                toast.error("Failed to send file via Telegram bot.");
            }
        } catch (error) {
            console.error("Error sending file:", error);
        }
    };
    
    const handleExport = () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(parsedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    
            const fileBlob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
    
            sendFileToTelegram(fileBlob, fileName);
        } catch (error) {
            console.error("Export failed:", error);
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
