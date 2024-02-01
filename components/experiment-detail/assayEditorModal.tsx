
import { AssayEditingContext } from "@/lib/context/assayEditingContext";
import { useExperimentInfo, useMutationToUpdateAssayResult } from "@/lib/hooks/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/useExperimentId";
import { Typography, Container, Button, Modal, Dialog, TextField} from "@mui/material";
import React, { useContext,  useState, useEffect } from "react";
import { LoadingCircle } from "../shared/loading";
import { ErrorMessage } from "../shared/errorMessage";
import { getErrorMessage } from "@/lib/api/apiHelpers";



const DEFAULT_RESULT = "";

export const AssayEditorModal: React.FC = () => {
    const {isEditing, setIsEditing, assayIdBeingEdited} = useContext(AssayEditingContext);
    const experimentId = useExperimentId();
    const {data, isLoading, isError} = useExperimentInfo(experimentId);
    const [newResult, setNewResult] = useState<string>(DEFAULT_RESULT);
    const {mutate : updateAssayResultInDB, isLoading : isUpdatingDB, isError : isErrorUpdatingDB, error} = useMutationToUpdateAssayResult();
    useEffect(() => {
        if (data) {
            const assay = data?.assays.findLast((assay) => assay.id === assayIdBeingEdited);
            if (assay && assay.result) {
                setNewResult(assay.result);
            } else {
                setNewResult(DEFAULT_RESULT);
            }
        } else {
            setNewResult(DEFAULT_RESULT);
        }
    }, [data, assayIdBeingEdited]);


    if (!isEditing || isError || isLoading || !data ){
        return null;
    } else {

        return (
            <Dialog open={isEditing} hideBackdrop={true}>
                <Typography>Edit Result for assay {assayIdBeingEdited}</Typography>
                <TextField value={newResult} onChange={(e) => setNewResult(e.target.value)}></TextField>
                <Button onClick={() => {updateAssayResultInDB({assayId : assayIdBeingEdited, experimentId : experimentId, newResult})}}>Submit New Result</Button>
                {isUpdatingDB ? <LoadingCircle/> : null}
                <Button onClick={() => setIsEditing(false)}>Close Editor</Button>
                {isErrorUpdatingDB ? <ErrorMessage message={getErrorMessage(error)}/> : null}
            </Dialog>

        );
    };
}