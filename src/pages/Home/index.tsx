import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Typography from '@mui/material/Typography';
import FileUploader from "../components/FileUploader";
import { Activity, useState } from "react";
import type { TranscriptionResponse } from "../../types/transcription";
import TranscriptionTextBox from "../components/TranscriptionTextBox";

export default function Home() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [transcriptBoxIsOpen, setTranscriptBoxIsOpen] = useState(false);
    const [transcriptionData, setTranscriptionData] = useState<TranscriptionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);


    const handleTranscriptionComplete = (data: TranscriptionResponse | null, uploadedFile?: File) => {
        setTranscriptionData(data);
        setTranscriptBoxIsOpen(true);
    };

    const handleFilesUpdate = (newFiles: File[]) => {
        setFiles(newFiles);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ gap: '40px' }}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="500px" width="100%" gap="30px" sx={{ bgcolor: colors.grey[800], borderRadius: 4 }}>
                <Typography variant="h1" fontWeight="700">
                    Transcription Software Online
                </Typography>
                <Typography variant="h3" align="center" sx={{
                    color: colors.grey[200]
                }}>
                    No more paying ridiculous subscription fees to transcribe your audio files.
                    <br />We'll do it for free here!
                </Typography>
                <FileUploader onTranscriptionComplete={handleTranscriptionComplete} setIsLoading={setIsLoading} files={files} setFiles={handleFilesUpdate} />
            </Box>
            <Activity mode={transcriptBoxIsOpen ? 'visible' : 'hidden'}>
                <TranscriptionTextBox data={transcriptionData} files={files} />
            </Activity>
        </Box>
    )
}