import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Typography from '@mui/material/Typography';
import FileUploader from "../components/FileUploader";

export default function Home() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="500px" width="100%" gap="30px" sx={{ bgcolor: colors.grey[800], borderRadius: 4 }}>
            <Typography variant="h1" fontWeight="700">
                Transcription Software Online
            </Typography>
            <Typography variant="h3" align="center" sx={{
                color: colors.grey[200]
            }}>
                No more paying ridiculous subscription fees to transcribe your audio files. <br />We'll do it for free here!
            </Typography>
            <FileUploader />
        </Box>
    )
}