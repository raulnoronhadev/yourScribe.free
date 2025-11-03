import { useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Box, Typography, useTheme, LinearProgress } from "@mui/material";
import { tokens } from "../../theme";
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import type { TranscriptionResponse } from "../../types/transcription";
import api from "../../services/api/axios-config/axiosConfig";
import { useMutation } from "@tanstack/react-query";
import type { AxiosProgressEvent } from "axios";


interface IFileUploaderProps {
    onTranscriptionComplete: (data: TranscriptionResponse) => void;
    setIsLoading: (value: boolean) => void;
    files: File[];
    setFiles: (files: File[]) => void;
}

export default function FileUploader({ onTranscriptionComplete, setIsLoading, files, setFiles }: IFileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const uploadFileToTranscriptionEndpointMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('language', 'en');

            const response = await api.post('/transcribe-simple', formData, {
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    } else {
                        console.log('Bytes enviados:', progressEvent.loaded);
                    }
                },
            });
            return response.data;
        },
        onMutate: () => {
            setUploadProgress(0);
            setIsLoading(true);
        },
        retry: 3,
        retryDelay: 800,
        onSuccess: (data) => {
            console.log(data);
            onTranscriptionComplete(data);
            setTimeout(() => setUploadProgress(0));
        },
        onError: (error) => {
            console.error('Upload failed', error);
            setUploadProgress(0);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles: File[] = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles([...files, ...droppedFiles]);
            uploadFileToTranscriptionEndpointMutation.mutate(droppedFiles[0]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
    };

    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles: File[] = Array.from(e.target.files);
            setFiles([...files, ...selectedFiles]);
            uploadFileToTranscriptionEndpointMutation.mutate(selectedFiles[0]);
        }
    };

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleManualUpload = () => {
        if (files.length > 0) {
            uploadFileToTranscriptionEndpointMutation.mutate(files[0]);
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
                <Button
                    onClick={handleIconClick}
                    sx={{
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
                    onClick={handleManualUpload}
                    disabled={files.length === 0}
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
                        '&:disabled': {
                            bgcolor: colors.grey[700],
                            cursor: 'not-allowed',
                        }
                    }}>
                    Upload files
                </Button>
            </Box >
            {uploadFileToTranscriptionEndpointMutation.isPending &&
                <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Uploading... {uploadProgress}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>
            }
        </Box>
    );
};
