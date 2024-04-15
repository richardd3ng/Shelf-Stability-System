import { useLoading } from "@/lib/context/shared/loadingContext";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { fetchAssayEditInfo } from "@/lib/controllers/assayController";
import { createAssayResult, deleteAssayResult, updateAssayResult } from "@/lib/controllers/assayResultController";
import { getQueryKeyForUseExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

interface AssayEditFormProps {
    experimentId: number;
    assayId: number;
    allowDeletion?: boolean;
    onSubmit?: () => void;
    loadForeverOnSubmit?: boolean;
}

export default function AssayEditForm({ experimentId, assayId, allowDeletion, onSubmit, loadForeverOnSubmit }: AssayEditFormProps) {
    const { user } = useContext(CurrentUserContext);

    const { showLoading, hideLoading } = useLoading();

    async function fetchAssayDetails() {
        const editInfo = await fetchAssayEditInfo(assayId)
        setFullSample(`${editInfo.experimentId}-${editInfo.sample.toString().padStart(3, "0")}`);
        setTitle(editInfo.title);
        setWeek(editInfo.week.toString());
        setTargetDate(editInfo.targetDate.toString());
        setCondition(editInfo.condition);
        setAssayType(editInfo.type);
        setUnits(editInfo.units);
        setAssayResultId(editInfo.resultId);
        setValue(editInfo.resultValue?.toString() ?? "");
        setComment(editInfo.resultComment?.toString() ?? "");
        setOwner(editInfo.owner);
        setTechnician(editInfo.technician);
        setIsCanceled(editInfo.isCanceled);

        hideLoading();
    }

    useEffect(() => {
        showLoading("Loading assay details...");

        if (isNaN(experimentId) || experimentId < 0 || isNaN(assayId) || assayId < 0) {
            return;
        }

        fetchAssayDetails();
    }, [experimentId, assayId]);

    const [fullSample, setFullSample] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [week, setWeek] = useState<string>("");
    const [targetDate, setTargetDate] = useState<string>("");
    const [condition, setCondition] = useState<string>("");
    const [assayType, setAssayType] = useState<string>("");
    const [units, setUnits] = useState<string | null>(null);
    const [assayResultId, setAssayResultId] = useState<number | null>(null);
    const [owner, setOwner] = useState<string>("");
    const [technician, setTechnician] = useState<string | null>(null);
    const [isCanceled, setIsCanceled] = useState<boolean>(false);

    const [value, setValue] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [valueError, setValueError] = useState<boolean>(false);
    const [commentError, setCommentError] = useState<boolean>(false);
    const [valueErrorText, setValueErrorText] = useState<string>("");
    const [commentErrorText, setCommentErrorText] = useState<string>("");

    if (user !== undefined && !(
        user.isAdmin ||
        user.username === owner ||
        user.username === technician
    )) {
        return <Typography variant="body1">You do not have permission to edit this assay</Typography>;
    }

    if (isCanceled) {
        return <Typography variant="body1">This experiment has been canceled, and assay results can no longer be edited</Typography>;
    }

    const queryClient = useQueryClient();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setValueError(false);
        setCommentError(false);
        setValueErrorText("");
        setCommentErrorText("");

        const then = () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            onSubmit?.();
            if (!loadForeverOnSubmit) {
                hideLoading();
            }
        };

        if (value === "" && comment === "") {
            // Delete result if empty
            if (allowDeletion) {
                showLoading("Deleting result...");
                if (assayResultId !== null) {
                    deleteAssayResult(assayResultId!).then(then);
                    setAssayResultId(null);
                } else {
                    then();
                }
                return;
            }
            setValueError(true);
            setCommentError(true);
            setCommentErrorText("Please enter a value or comment");
            return;
        }

        const valueNumber = Number(value);

        if (value !== "" && isNaN(valueNumber)) {
            setValueError(true);
            setValueErrorText("Value must be a number");
            return;
        }

        showLoading("Updating result...");

        const updateParams = {
            assayId: Number(assayId),
            result: value === "" ? null : valueNumber,
            comment: comment === "" ? null : comment,
            author: `${user?.displayName} (${user?.username})`
        };

        if (assayResultId === null) {
            createAssayResult(updateParams)
            .then((res) => setAssayResultId(res.id))
            .then(then);
        } else {
            updateAssayResult({
                id: assayResultId,
                ...updateParams
            })
            .then(then);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack maxWidth={350} spacing={1}>
                <Typography variant="body1">
                    {title}
                </Typography>
                <Divider />
                <Typography variant="body1">
                    {condition}
                    <br />{targetDate} (Week {week})
                    <br />{assayType}
                    <br />{fullSample}
                </Typography>

                <Box sx={{ alignItems: "center", display: "flex", width: "100%" }}>
                    <TextField
                        label="Value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        error={valueError}
                        helperText={valueErrorText}
                        sx={{ flex: 1 }}
                    />
                    {units && <Typography sx={{ pl: 1 }}>{units}</Typography>}
                </Box>
                <TextField
                    label="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    error={commentError}
                    helperText={commentErrorText}
                />
                <Button type="submit" variant="contained">Submit</Button>
            </Stack>
        </form>
    );
}