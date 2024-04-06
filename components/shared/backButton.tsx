import { Button, Typography, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";

interface BackButtonProps {
    text?: string;
    url?: string;
}

const BackButton: React.FC<BackButtonProps> = (props: BackButtonProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (props.url) {
            router.push(props.url);
        } else {
            router.back();
        }
    };

    return (
        <Button
            onClick={handleBack}
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
                    {props.text || "Back"}
                </Typography>
            </Box>
        </Button>
    );
};

export default BackButton;
