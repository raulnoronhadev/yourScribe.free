import { useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import type { TranscriptionResponse } from "../../types/transcription";
import api from "../../api/api";

interface FileUploaderProps {
    onTranscriptionComplete: (data: TranscriptionResponse) => void;
}

export default function FileUploader({ onTranscriptionComplete }: FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            const selectedFiles: File[] = Array.from(e.target.files);
            setFiles(selectedFiles);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const uploadFiles = async () => {
        handleButtonClick();
        if (!files || files.length === 0) {
            console.error("No files found");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('video', files[0]);
            formData.append('language', 'en');
            const response = await api.post('/transcribe-simple', formData);
            console.log(response.data);
            onTranscriptionComplete(response.data);
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <Box sx={{
            m: 2,
            bgcolor: colors.grey[900],
            borderRadius: "15px",
            p: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: "none" }}
            />
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRadius: "10px",
                    backgroundColor: isDragging ? "#f0f8ff" : colors.grey[900],
                    color: "black",
                    height: "210px",
                    width: "560px",
                    p: 3,
                    gap: 1,
                    border: `1px dashed ${colors.blueAccent[500]}`,
                }}
            >
                <Button sx={{
                    height: 70,
                    width: 70,
                    borderStyle: 'solid',
                    borderColor: colors.blueAccent[700],
                    borderRadius: 2,
                    border: `1px solid ${colors.blueAccent[500]}`,
                    '&:hover': {
                        bgcolor: colors.grey[600],
                    }
                }}>
                    <FileUploadOutlinedIcon sx={{ fontSize: 35 }} />
                </Button>
                <Typography variant="h3" sx={{ color: colors.grey[100], }}>Drag and drop files here</Typography>
                <Button
                    onClick={uploadFiles}
                    sx={{
                        p: 2,
                        bgcolor: colors.blueAccent[700],
                        width: '100%',
                        height: 40,
                        borderRadius: 1,
                        color: colors.primary[100],
                        textTransform: 'none',
                        fontSize: 14,
                        fontWeight: 600,
                    }}>
                    Upload files
                </Button>
            </Box >
        </Box>
    );
};
