import { Box, Typography, useTheme, Button, Divider } from "@mui/material";
import { tokens } from "../../theme";
import type { TranscriptionResponse } from "../../types/transcription";
import { ImproveTextService } from "../../services/api/improveTranscription/ImproveTextService";
import { useState } from "react";

interface ImproveTextResponse {
    success: boolean;
    original: string;
    improved: string;
    model: string;
}

export default function TranscriptionTextBox({ data }: { data: TranscriptionResponse | null }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isImproving, setIsImproving] = useState(false);
    const [isImproved, setIsImproved] = useState(false);
    const [improvedText, setImprovedText] = useState<string | null>(null);

    const handleImproveText = async () => {
        if (!data) return;

        try {
            setIsImproving(true);
            const response: ImproveTextResponse = await ImproveTextService(data);
            if (response.success) {
                setImprovedText(response.improved);
                setIsImproved(true);
                console.log('Text improved successfully!');
            }
        } catch (error) {
            console.error('Failed to improve text:', error);
        } finally {
            setIsImproving(false);
        }
    }

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "10px",
            backgroundColor: colors.grey[900],
            color: "black",
            width: "100%",
            p: 3,
            border: `1px solid ${colors.blueAccent[500]}`,
        }}>
            <Button
                onClick={handleImproveText}
                sx={{
                    bgcolor: colors.blueAccent[700],
                    p: 1.5,
                    color: colors.primary[100],
                    textTransform: 'none',
                    fontSize: 12,
                    fontWeight: 500,
                    mb: 2,
                }}>
                {isImproving ? 'Improving...' : 'Improve this text'}
            </Button>
            <Box sx={{
                bgcolor: colors.blueAccent[700],
                p: 2,
                borderRadius: 2,
            }}>
                <Typography sx={{
                    color: colors.primary[100],
                }}>
                    {data?.transcription}
                </Typography>
            </Box>
            {isImproved &&
                <Box
                    sx={{
                        bgcolor: colors.blueAccent[700],
                        borderRadius: 2,
                        p: isImproved ? 2 : 0,
                        width: '100%',
                        mt: 2,
                    }}>
                    <Typography sx={{ color: colors.primary[100] }}>
                        {improvedText}
                    </Typography>
                </Box>
            }
        </Box>
    )
}