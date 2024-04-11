import { useLoading } from "@/lib/context/shared/loadingContext";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { fetchAssay } from "@/lib/controllers/assayController";
import { createAssayResult, fetchResultForAssay, updateAssayResult } from "@/lib/controllers/assayResultController";
import { fetchAssayType, fetchAssayTypeForExperiment } from "@/lib/controllers/assayTypeController";
import { fetchCondition } from "@/lib/controllers/conditionController";
import { getQueryKeyForUseExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

interface AssayEditFormProps {
    experimentId: number;
    assayId: number;
    onSubmit?: () => void;
    loadForeverOnSubmit?: boolean;
}

export default function AssayEditForm({ experimentId, assayId, onSubmit, loadForeverOnSubmit }: AssayEditFormProps) {
    const user = useContext(CurrentUserContext);

    const { showLoading, hideLoading } = useLoading();

    async function fetchAssayDetails() {
        // TODO all these different calls can definitely be sped up
        // At the very least by combining them into a single API call
        const assay = await fetchAssay(assayId)
        setFullSample(`${assay.experimentId}-${assay.sample.toString().padStart(3, "0")}`);
        setWeek(assay.week.toString());

        const [condition, assayType, result] = await Promise.all([
            fetchCondition(assay.conditionId),
            fetchAssayTypeForExperiment(assay.assayTypeId)
                .then(assayTypeForExperiment => fetchAssayType(assayTypeForExperiment.assayTypeId)),
            fetchResultForAssay(assayId)
        ]);
        setCondition(condition.name);
        setAssayType(assayType.name);
        setUnits(assayType.units);
        if (result !== null) {
            setAssayResultId(result.id);
            setValue(result.result?.toString() ?? "");
            setComment(result.comment?.toString() ?? "");
        }

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
    const [week, setWeek] = useState<string>("");
    const [condition, setCondition] = useState<string>("");
    const [assayType, setAssayType] = useState<string>("");
    const [units, setUnits] = useState<string | null>(null);
    const [assayResultId, setAssayResultId] = useState<number | null>(null);

    const [value, setValue] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [valueError, setValueError] = useState<boolean>(false);
    const [commentError, setCommentError] = useState<boolean>(false);
    const [valueErrorText, setValueErrorText] = useState<string>("");
    const [commentErrorText, setCommentErrorText] = useState<string>("");

    const queryClient = useQueryClient();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setValueError(false);
        setCommentError(false);
        setValueErrorText("");
        setCommentErrorText("");

        if (value === "" && comment === "") {
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
            author: `${user.user?.displayName} (${user.user?.username})`
        };

        const then = () => {
            queryClient.invalidateQueries({
                queryKey: getQueryKeyForUseExperimentInfo(experimentId),
            });
            onSubmit?.();
            if (!loadForeverOnSubmit) {
                hideLoading();
            }
        };

        if (assayResultId === null) {
            createAssayResult(updateParams).then(then);
        } else {
            updateAssayResult({
                id: assayResultId,
                ...updateParams
            }).then(then);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack maxWidth={350} spacing={1}>
                <Typography variant="body1">
                    {fullSample}
                    <br />Week: {week}
                    <br />Condition: {condition}
                    <br />{assayType}
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