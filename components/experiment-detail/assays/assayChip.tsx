import { Box, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import {
    getAssayTypeUnits,
    getCorrespondingAssayType,
} from "@/lib/controllers/assayTypeController";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import React, { useContext, useState } from "react";
import { Assay, AssayResult } from "@prisma/client";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";
import { useMutationToDeleteAssay } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import AssayEditorModal from "./assayEditorModal";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import AssayResultEditingContext from "@/lib/context/shared/assayResultEditingContext";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { AssayTypeInfo } from "@/lib/controllers/types";
import DeleteAssayButton from "./deleteAssayButton";

interface AssayChipProps {
    assay: Assay;
    assayResult?: AssayResult;
}

const AssayChip: React.FC<AssayChipProps> = (props: AssayChipProps) => {
    const { data: experimentInfo } = useExperimentInfo(
        props.assay.experimentId
    );
    const { mutate: deleteAssay } = useMutationToDeleteAssay();
    const [showLastEditor, setShowLastEditor] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(CurrentUserContext);
    const experimentSpecificAssayType = getCorrespondingAssayType(
        props.assay.assayTypeId,
        experimentInfo?.assayTypes ?? []
    );
    const isTechnician: boolean =
        user?.id === experimentSpecificAssayType?.technicianId ?? false;
    const isAdminOrOwner: boolean =
        (user?.isAdmin || user?.id === experimentInfo?.experiment.ownerId) ??
        false;

    const isDeletable: boolean =
        !experimentInfo?.experiment.isCanceled && isAdminOrOwner;
    const isEditable: boolean =
        !experimentInfo?.experiment.isCanceled &&
        (isAdminOrOwner || isTechnician);

    const getResultText = (
        assayTypesForExperiment: AssayTypeInfo[]
    ): string => {
        const units: string = getAssayTypeUnits(
            props.assay.assayTypeId,
            assayTypesForExperiment
        );
        const resultText: string =
            props.assayResult && props.assayResult.result !== null
                ? `${props.assayResult.result}${
                      units.startsWith("%") ? units : ` ${units}`
                  }`
                : "N/A";
        return resultText;
    };

    const hash = `assay-chip-${props.assay.id}`;

    if (!experimentInfo) {
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
                    backgroundColor:
                        window && window.location.hash === `#${hash}`
                            ? "#dcdcec"
                            : undefined,
                }}
                id={hash}
            >
                <Stack sx={{ margin: -0.25 }}>
                    <Typography sx={{ fontSize: 16 }}>
                        {assayTypeIdToName(
                            props.assay.assayTypeId,
                            experimentInfo.assayTypes
                        )}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>
                        {getResultText(experimentInfo.assayTypes)}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>
                        {`${props.assay.sample.toString().padStart(3, "0")}`}
                    </Typography>
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
                                    {`Author: ${
                                        props.assayResult?.author ?? "N/A"
                                    }`}
                                </Typography>
                            }
                            open={showLastEditor}
                            arrow
                        >
                            <IconButton
                                size="small"
                                disableTouchRipple
                                onMouseEnter={() => setShowLastEditor(true)}
                                onMouseLeave={() => setShowLastEditor(false)}
                                sx={{
                                    cursor: "default",
                                    "&:hover": {
                                        backgroundColor: "inherit !important",
                                    },
                                }}
                            >
                                <PersonIcon
                                    sx={{ fontSize: 20, color: "gray" }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={
                                <Typography fontSize={16}>
                                    {`Comment: ${
                                        props.assayResult?.comment ?? "N/A"
                                    }`}
                                </Typography>
                            }
                            open={showComment}
                            arrow
                        >
                            <IconButton
                                size="small"
                                disableTouchRipple
                                onMouseEnter={() => setShowComment(true)}
                                onMouseLeave={() => setShowComment(false)}
                                sx={{
                                    cursor: "default",
                                    "&:hover": {
                                        backgroundColor: "inherit !important",
                                    },
                                }}
                            >
                                <MessageIcon
                                    sx={{ fontSize: 20, color: "gray" }}
                                />
                            </IconButton>
                        </Tooltip>
                        {isEditable && (
                            <IconButton
                                size="small"
                                onClick={() => setIsEditing(true)}
                            >
                                <EditIcon
                                    sx={{ fontSize: 20, color: "gray" }}
                                />
                            </IconButton>
                        )}
                        {isDeletable && (
                            <DeleteAssayButton
                                id={props.assay.id}
                                type={assayTypeIdToName(
                                    props.assay.assayTypeId,
                                    experimentInfo.assayTypes
                                )}
                            />
                        )}
                    </Box>
                </Stack>
            </Box>
            <AssayEditingContext.Provider
                value={{
                    assay: props.assay,
                    setAssay: (_assay: Assay) => {},
                    isEditing,
                    setIsEditing,
                }}
            >
                <AssayResultEditingContext.Provider
                    value={{
                        assayResult: props.assayResult,
                        setAssayResult: (
                            _result: AssayResult | undefined
                        ) => {},
                        isEditing,
                        setIsEditing,
                    }}
                >
                    <AssayEditorModal />
                </AssayResultEditingContext.Provider>
            </AssayEditingContext.Provider>
        </>
    );
};

export default AssayChip;
