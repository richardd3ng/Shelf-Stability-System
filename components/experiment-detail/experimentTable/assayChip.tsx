import { Box, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import { getAssayTypeUnits } from "@/lib/controllers/assayTypeController";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import React, { useState } from "react";
import { Assay, AssayResult } from "@prisma/client";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";

interface AssayChipProps {
    assay: Assay;
    assayResult?: AssayResult;
}

const AssayChip: React.FC<AssayChipProps> = (props: AssayChipProps) => {
    const units: string = getAssayTypeUnits(props.assay.type);
    const resultText: string = props.assayResult
        ? `${props.assayResult.result}${
              units.startsWith("%") ? units : ` ${units}`
          }`
        : "No Result Recorded";

    const [showLastEditor, setShowLastEditor] = useState(false);
    const [showComment, setShowComment] = useState(false);

    const handleEdit = () => {
        // Implement edit functionality
    };

    const handleDelete = () => {
        // Implement delete functionality
    };

    return (
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
                            <PersonIcon sx={{ fontSize: 20, color: "gray" }} />
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
                            <MessageIcon sx={{ fontSize: 20, color: "gray" }} />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={handleEdit}>
                        <EditIcon sx={{ fontSize: 20, color: "gray" }} />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon sx={{ fontSize: 20, color: "gray" }} />
                    </IconButton>
                </Box>
            </Stack>
        </Box>
    );
};

export default AssayChip;
