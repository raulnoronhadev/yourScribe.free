import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Typography from '@mui/material/Typography';
import FileUploader from "../components/FileUploader";
import { useState } from "react";

// Defina o tipo conforme o que sua API retorna
export interface TranscriptionResponse {
    success: boolean;
    transcription: string;
    segments: Segment[];
    language: string;
    file_type: string;
}

export interface Segment {
    id?: number;
    start?: number;
    end?: number;
    text?: string;
}

export default function Home() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [transcriptBoxIsOpen, setTranscriptBoxIsOpen] = useState(false);
    const [transcriptionData, setTranscriptionData] = useState<TranscriptionResponse | null>(null);

    const handleTranscriptionComplete = (data: TranscriptionResponse | null) => {
        setTranscriptionData(data);
        setTranscriptBoxIsOpen(true);
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
                <FileUploader onTranscriptionComplete={handleTranscriptionComplete} />
            </Box>
            {transcriptBoxIsOpen && (
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRadius: "10px",
                    backgroundColor: colors.grey[900],
                    color: "black",
                    height: "210px",
                    width: "560px",
                    p: 3,
                    gap: 1,
                    border: `1px dashed ${colors.blueAccent[500]}`,
                }}>
                    <Typography>
                        {transcriptionData?.transcription}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}