import CloseableModal from "@/components/shared/closeableModal";
import React, { useContext } from "react";
import { CreateOrEditAssayTypeForm } from "./createOrEditAssayTypeForm";
import { useMutationToUpdateAssayType } from "@/lib/hooks/experimentDetailPage/useUpdateEntityHooks";
import AssayTypeEditingContext from "@/lib/context/experimentDetailPage/assayTypeEditingContext";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import { checkIfThereAreRecordedResultsForAssayType } from "@/lib/controllers/assayTypeController";

export const EditAssayTypeModal: React.FC = () => {
    const { mutate : editType } = useMutationToUpdateAssayType();
    const {assayTypeIdBeingEdited, setAssayTypeIdBeingEdited, isEditing, setIsEditing, name, units, description, technicianId, setName, setUnits, setDescription, setTechnicianId } = useContext(AssayTypeEditingContext);
    const experimentId = useExperimentId();
    const {data : experimentInfo} = useExperimentInfo(experimentId);
    const {isAdmin} = useUserInfo();
    let correspondingAssayType = experimentInfo?.assayTypes.find((type) => type.id === assayTypeIdBeingEdited);
    let canEditTextFields = correspondingAssayType && correspondingAssayType.assayType.isCustom && isAdmin && experimentInfo && !experimentInfo.experiment.isCanceled && !checkIfThereAreRecordedResultsForAssayType(assayTypeIdBeingEdited, experimentInfo);
    
    return (
        <CloseableModal
            open={isEditing}
            closeFn={() => setIsEditing(false)}
            title="Edit Assay Type"
        >
            <CreateOrEditAssayTypeForm 
                name={name}
                setName={setName}
                units={units}
                setUnits={setUnits}
                description={description}
                setDescription={setDescription}
                technicianId={technicianId}
                setTechnicianId={setTechnicianId}
                disableTextFields={!canEditTextFields}
                buttonText="Submit"
                onSubmit={() => {
                    editType({
                        assayTypeForExperimentId : assayTypeIdBeingEdited,
                        description: description,
                        name: name,
                        units: units,
                        assayTypeId : assayTypeIdBeingEdited,
                        technicianId: technicianId,
                    });
                    setIsEditing(false);
                }}    
            />
        </CloseableModal>
    );
};
