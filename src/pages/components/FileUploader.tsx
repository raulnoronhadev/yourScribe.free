import { useState } from "react";
import type { DragEvent } from "react";

export default function FileUploader() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const droppedFiles: File[] = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
    };

    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
                backgroundColor: isDragging ? "#f0f8ff" : "#fff",
            }}
        >
            <p>Drag and drop files here</p>
            <ul>
                {files.map((file: File, index: number) => (
                    <li key={index}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};
