import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import type { TranscriptionResponse } from "../../types/transcription";

export default function TranscriptionTextBox({ data }: { data: TranscriptionResponse | null }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
            gap: 1,
            border: `1px dashed ${colors.blueAccent[500]}`,
        }}>
            <Typography sx={{ color: colors.primary[100] }}>
                {data?.transcription}
            </Typography>
        </Box>
    )
}