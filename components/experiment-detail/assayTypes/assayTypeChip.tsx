import { Box, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import { getAssayTypeUnits } from "@/lib/controllers/assayTypeController";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import React, { useContext, useState } from "react";
import { Assay, AssayResult } from "@prisma/client";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";
import { useMutationToDeleteAssay } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import AssayEditorModal from "../modifications/editorModals/assayEditorModal";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { AssayTypeInfo } from "@/lib/controllers/types";

interface AssayTypeChipProps {
    assayType: AssayTypeInfo;
}

export const AssayTypeChip: React.FC<AssayTypeChipProps> = (props: AssayTypeChipProps) => {
    const { data: experimentInfo } = useExperimentInfo(props.assayType.experimentId);
    const { mutate: deleteAssay } = useMutationToDeleteAssay();
    const [showLastEditor, setShowLastEditor] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(CurrentUserContext);
    const isAdminOrOwner: boolean =
        (user?.isAdmin || user?.id === experimentInfo?.experiment.ownerId) ?? false;



    if (!experimentInfo){
        return null;
    }
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
                <Stack sx={{ margin: -0.25 }}>
                    <Typography sx={{ fontSize: 16 }}>
                        {props.assayType.assayType.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>{props.assayType.assayType.units}</Typography> 
                    <Box
                        sx={{
                            marginY: -0.25,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Tooltip
                            title={
                                <Typography fontSize={16}>
                                    {`Technician: ${
                                        props.assayType.technicianId ?? "N/A"
                                    }`}
                                </Typography>
                            }
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
                                size="small"
                                disableTouchRipple
                                onMouseEnter={() => setShowLastEditor(true)}
                                onMouseLeave={() => setShowLastEditor(false)}
                            >
                                <PersonIcon
                                    sx={{ fontSize: 20, color: "gray" }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={
                                <Typography fontSize={16}>
                                    {`Description: ${
                                        props.assayType.assayType.description ?? "N/A"
                                    }`}
                                </Typography>
                            }
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
                                size="small"
                                disableTouchRipple
                                onMouseEnter={() => setShowComment(true)}
                                onMouseLeave={() => setShowComment(false)}
                            >
                                <MessageIcon
                                    sx={{ fontSize: 20, color: "gray" }}
                                />
                            </IconButton>
                        </Tooltip>
                        {isAdminOrOwner && (
                            <Box>
                                <IconButton
                                    size="small"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <EditIcon
                                        sx={{ fontSize: 20, color: "gray" }}
                                    />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => deleteAssay(props.assayType.id)}
                                >
                                    <DeleteIcon
                                        sx={{ fontSize: 20, color: "gray" }}
                                    />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </Box>

        </>
    );
};


