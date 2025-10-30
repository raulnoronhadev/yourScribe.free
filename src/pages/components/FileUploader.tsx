import { useState } from "react";
import type { DragEvent } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

export default function FileUploader() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const droppedFiles: File[] = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
        console.log(files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
    };

    const handleDragEnter = () => setIsDragging(true);
    const handleDragLeave = () => setIsDragging(false);

    return (
        <Box sx={{
            m: 2,
            bgcolor: colors.grey[900],
            borderRadius: "15px",
            p: 1,
        }}>
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
                    backgroundColor: isDragging ? "#f0f8ff" : colors.grey[800],
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
                {/* <List>
                {files.map((file: File, index: number) => (
                    <ListItem key={index}>{file.name}</ListItem>
                ))}
            </List> */}
            </Box >
        </Box>
    );
};
