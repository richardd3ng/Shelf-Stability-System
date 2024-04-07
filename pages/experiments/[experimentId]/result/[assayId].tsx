import Layout from "@/components/shared/layout";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { fetchAssay } from "@/lib/controllers/assayController";
import { createAssayResult, fetchResultForAssay, getAssayResult, updateAssayResult } from "@/lib/controllers/assayResultController";
import { fetchAssayType, fetchAssayTypeForExperiment } from "@/lib/controllers/assayTypeController";
import { fetchCondition } from "@/lib/controllers/conditionController";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";


export default function ResultEntryPage() {
    const router = useRouter();
    const user = useContext(CurrentUserContext);

    const { experimentId, assayId } = router.query;
    const { showLoading, hideLoading } = useLoading();

    async function fetchAssayDetails(assayId: number) {
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

        if (typeof experimentId !== "string" || typeof assayId !== "string") {
            return;
        }

        // TODO maybe show error message if experimentId or sampleId is not a number
        const assayIdNumber = Number(assayId);

        fetchAssayDetails(assayIdNumber);
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
        
        const then = () => router.push(`/experiments/${experimentId}`);

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
        <Layout>
            <form onSubmit={handleSubmit}>
                <Stack maxWidth={350} spacing={1} paddingLeft={1.5}>
                    <Typography variant="h4">Enter Assay Result</Typography>
                    <Typography variant="body1">
                        {fullSample}
                        <br />Week: {week}
                        <br />Condition: {condition}
                        <br />{assayType}
                    </Typography>

                    <Box sx={{alignItems: "center", display: "flex", width: "100%"}}>
                        <TextField
                            label="Value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            error={valueError}
                            helperText={valueErrorText}
                            sx={{flex: 1}}
                        />
                        {units && <Typography sx={{pl: 1}}>{units}</Typography>}
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
        </Layout>
    );
}