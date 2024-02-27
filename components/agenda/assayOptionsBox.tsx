import React, { useContext } from "react";
import Link from "next/link";
import { IconButton, Box } from "@mui/material";
import ViewIcon from "@mui/icons-material/Visibility";
import { Edit } from "@mui/icons-material";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { getAssayResult } from "@/lib/controllers/assayResultController";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import { fetchAssay } from "@/lib/controllers/assayController";

interface AssayOptionsBoxProps {
    experimentId: number;
    assayId: number;
    assayResultId: number | null;
}

export const AssayOptionsBox: React.FC<AssayOptionsBoxProps> = (
    props: AssayOptionsBoxProps
) => {
    const { setAssayResult, setIsEditing } = useContext(AssayResultEditingContext);
    const { setAssay } = useContext(AssayEditingContext);
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
                    const assayPromise = fetchAssay(props.assayId).then((assay) => {
                        setAssay(assay);
                    });
                    if (props.assayResultId === null) {
                        assayPromise.then(() => {
                            setAssayResult(undefined);
                            setIsEditing(true);
                        });
                        return;
                    }
                    Promise.all([
                        getAssayResult(props.assayResultId).then((result) => {
                            setAssayResult(result);
                        }),
                        assayPromise,
                    ]).then(() => setIsEditing(true));
                }}
            >
                <Edit />
            </IconButton>
        </Box>
    );
};
