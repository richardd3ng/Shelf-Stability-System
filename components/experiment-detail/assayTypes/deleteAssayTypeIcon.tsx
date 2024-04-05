import React, {useState} from "react"
import Delete from "@mui/icons-material/Delete";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import { useMutationToDeleteAssayTypeForExperiment } from "@/lib/hooks/experimentDetailPage/useDeleteEntityHooks";
import { AssayTypeInfo } from "@/lib/controllers/types";
import ConfirmationDialog from "@/components/shared/confirmationDialog";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { checkIfThereAreRecordedResultsForAssayType } from "@/lib/controllers/assayTypeController";

export const DeleteAssayTypeIcon : React.FC<AssayTypeInfo> = (props : AssayTypeInfo) => {
    const {mutate : deleteAssayType} = useMutationToDeleteAssayTypeForExperiment();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
    const {isAdmin, isLoggedIn} = useUserInfo();
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    let canDelete = props.assayType.isCustom && isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled && !checkIfThereAreRecordedResultsForAssayType(props.id, experimentInfo);

    if (!canDelete){
        return null;
    }
    return (
        <>
            <IconButtonWithTooltip
                text="Delete"
                icon={Delete}
                onClick={() => {setShowConfirmationDialog(true)}}
                
            />
            <ConfirmationDialog
                open={showConfirmationDialog}
                text={"Are you sure you want to delete this assay type (" + (props.assayType.name) + ")?"}
                onClose={() => setShowConfirmationDialog(false)}
                onConfirm={() => deleteAssayType(props.id)}
            />

        </>

    )
}