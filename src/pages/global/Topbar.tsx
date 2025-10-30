import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

export default function Topbar() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    return (
        <Box display="flex" width="100%" height="80px" justifyContent="space-between">
            <IconButton>
                <Typography variant="h3" sx={{ p: 1 }}>
                    yourScribe
                </Typography>
            </IconButton>
            <Box display="flex" alignItems="center" gap="10px">
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none" }}>
                    Instructions
                </Button>
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none" }}>
                    FAQ
                </Button>
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none" }}>
                    Invite a Friend
                </Button>
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none" }}>
                    My Files
                </Button>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
                <Button sx={{ p: 2, bgcolor: colors.blueAccent[700], width: 80, height: 40, borderRadius: 2, color: colors.primary[100] }}>Sign In</Button>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
            </Box>
        </Box >
    );
}

