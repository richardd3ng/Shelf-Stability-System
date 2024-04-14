import CloseableModal from "@/components/shared/closeableModal";
import React, { useContext, useState } from "react";
import AssayTypeCreationContext from "@/lib/context/experimentDetailPage/assayTypeCreationContext";
import { useMutationToCreateCustomAssayType } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { CreateOrEditAssayTypeForm } from "./createOrEditAssayTypeForm";


export const CreateAssayTypeModal: React.FC = (props) => {
    const { isCreating, setIsCreating } = useContext(AssayTypeCreationContext);
    const experimentId = useExperimentId();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string | null>(null);
    const [units, setUnits] = useState<string | null>(null);
    const [technicianId, setTechnicianId] = useState<number | null>(null);
    const { mutate: createType } = useMutationToCreateCustomAssayType();

    return (
        <CloseableModal
            open={isCreating}
            closeFn={() => setIsCreating(false)}
            title="Create Custom Assay Type"
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
                buttonText="Create Type"
                onSubmit={() => {
                    createType({
                        description: description,
                        name: name,
                        units: units,
                        experimentId: experimentId,
                        technicianId: technicianId,
                    });
                    setIsCreating(false);
                }}    
                disableTextFields={false}
            />
        </CloseableModal>
    );
};
