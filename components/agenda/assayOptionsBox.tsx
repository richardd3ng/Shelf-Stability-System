import React, { useContext } from "react";
import Link from "next/link";
import { IconButton, Box } from "@mui/material";
import ViewIcon from "@mui/icons-material/Visibility";
import { Edit } from "@mui/icons-material";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";

interface AssayOptionsBoxProps {
    experimentId: number;
    assayId: number;
}

export const AssayOptionsBox: React.FC<AssayOptionsBoxProps> = (
    props: AssayOptionsBoxProps
) => {
    const { setId, setIsEditing } = useContext(AssayEditingContext);
    return (
        <Box sx={{ display: "flex" }}>
            <IconButton
                component={Link}
                href={`experiments/${props.experimentId}`}
            >
                <ViewIcon />
            </IconButton>
            <IconButton
                onClick={() => {
                    setId(props.assayId);
                    setIsEditing(true);
                }}
            >
                <Edit />
            </IconButton>
        </Box>
    );
};
