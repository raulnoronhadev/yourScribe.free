import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Topbar() {

    return (
        <Box display="flex" p={1} width="100%" height="60px" justifyContent="space-between">
            <IconButton>
                <Typography variant="h3" sx={{ p: 1 }}>
                    yourScribe
                </Typography>
            </IconButton>
            <Box display="flex" alignItems="center" gap="10px">
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none", }}>
                    Instructions
                </Button>
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none", }}>
                    FAQ
                </Button>
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none", }}>
                    Invite a Friend
                </Button>
                <Button sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: 17, textTransform: "none", }}>
                    My Files
                </Button>
            </Box>
            <Box>
                <Button sx={{ p: 2, bgcolor: 'green', width: 80, height: 40, borderRadius: 2 }}>Sign In</Button>
            </Box>
        </Box >
    );
}

