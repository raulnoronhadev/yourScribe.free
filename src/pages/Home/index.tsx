import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Home() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    return (
        <Box display="flex" height="500px" width="100%" sx={{}}>

        </Box>
    )
}