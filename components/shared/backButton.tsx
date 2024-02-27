import { Button, Typography, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";

interface BackButtonProps {
    text: string;
    onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = (props: BackButtonProps) => {
    const router = useRouter();
    return (
        <Button
            onClick={props.onClick || (() => router.back())}
            startIcon={<ArrowBack />}
            sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                "&:hover": {
                    backgroundColor: "transparent",
                },
            }}
            disableRipple
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                    sx={{
                        textDecoration: "underline",
                    }}
                >
                    {props.text}
                </Typography>
            </Box>
        </Button>
    );
};

export default BackButton;
