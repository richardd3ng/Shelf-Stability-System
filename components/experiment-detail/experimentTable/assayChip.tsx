import { Box, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import { getAssayTypeUnits } from "@/lib/controllers/assayTypeController";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import React, { useState } from "react";
import { Assay, AssayResult } from "@prisma/client";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";
import { useMutationToDeleteAssay } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { AssayEditorModal } from "../modifications/editorModals/assayEditorModal";
import { AssayEditingContext } from "@/lib/context/shared/assayEditingContext";
import {
    INVALID_ASSAY_ID,
    INVALID_ASSAY_RESULT_ID,
} from "@/lib/api/apiHelpers";
import { AssayResultEditingContext } from "@/lib/context/shared/assayResultEditingContext";

interface AssayChipProps {
    assay: Assay;
    assayResult?: AssayResult;
}

const AssayChip: React.FC<AssayChipProps> = (props: AssayChipProps) => {
    const { mutate: deleteAssay } = useMutationToDeleteAssay();
    const [showLastEditor, setShowLastEditor] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const units: string = getAssayTypeUnits(props.assay.type);
    const resultText: string = props.assayResult
        ? `${props.assayResult.result}${
              units.startsWith("%") ? units : ` ${units}`
          }`
        : "No Result Recorded";

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <>
            <Box
                sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "4px",
                    display: "inline-block",
                    textAlign: "center",
                }}
            >
                <Stack>
                    <Typography sx={{ fontSize: 16 }}>
                        {assayTypeIdToName(props.assay.type)}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>{resultText}</Typography>
                    <Box
                        sx={{
                            marginY: -0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Tooltip
                            title={`Author: ${
                                props.assayResult?.last_editor ?? "N/A"
                            }`}
                            open={showLastEditor}
                            arrow
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: "offset",
                                            options: {
                                                offset: [0, -14],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <IconButton
                                onMouseEnter={() => setShowLastEditor(true)}
                                onMouseLeave={() => setShowLastEditor(false)}
                            >
                                <PersonIcon
                                    sx={{ fontSize: 20, color: "gray" }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={`Comment: ${
                                props.assayResult?.comment ?? "N/A"
                            }`}
                            open={showComment}
                            arrow
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: "offset",
                                            options: {
                                                offset: [0, -14],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <IconButton
                                onMouseEnter={() => setShowComment(true)}
                                onMouseLeave={() => setShowComment(false)}
                            >
                                <MessageIcon
                                    sx={{ fontSize: 20, color: "gray" }}
                                />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleEdit}>
                            <EditIcon sx={{ fontSize: 20, color: "gray" }} />
                        </IconButton>
                        <IconButton onClick={() => deleteAssay(props.assay.id)}>
                            <DeleteIcon sx={{ fontSize: 20, color: "gray" }} />
                        </IconButton>
                    </Box>
                </Stack>
            </Box>
            <AssayEditingContext.Provider
                value={{
                    assayIdBeingEdited: props.assay.id,
                    setAssayIdBeingEdited: () => {},
                    isEditing,
                    setIsEditing,
                }}
            >
                <AssayResultEditingContext.Provider
                    value={{
                        assayResultIdBeingEdited:
                            props.assayResult?.id ?? INVALID_ASSAY_RESULT_ID,
                        setAssayResultIdBeingEdited: () => {},
                        isEditing: false,
                        setIsEditing: () => {},
                    }}
                >
                    <AssayEditorModal />
                </AssayResultEditingContext.Provider>
            </AssayEditingContext.Provider>
        </>
    );
};

export default AssayChip;
