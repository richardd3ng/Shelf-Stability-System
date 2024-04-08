import CloseableModal from "@/components/shared/closeableModal";
import { useMutationToCreateAssay } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";

import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import { useState } from "react";
import { AssayCreationArgs } from "@/lib/controllers/types";
import { useAlert } from "@/lib/context/shared/alertContext";
import { AssayTypeInfo } from "@/lib/controllers/types";

interface NewAssayModalProps {
    open: boolean;
    onClose: () => void;
    week: number;
    conditionId: number;
}

export const NewAssayModal: React.FC<NewAssayModalProps> = (
    props: NewAssayModalProps
) => {
    const experimentId = useExperimentId();
    const { data: experimentInfo } = useExperimentInfo(experimentId);
    const [selectedAssayTypeId, setSelectedAssayTypeId] = useState<number>(-1);
    const { mutate: createAssay } = useMutationToCreateAssay();
    const { showAlert } = useAlert();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAssayTypeId < 0) {
            showAlert("error", "Please select an assay type.");
            return;
        }
        const assayInfo: AssayCreationArgs = {
            experimentId: experimentId,
            conditionId: props.conditionId,
            assayTypeId: selectedAssayTypeId,
            week: props.week,
        };
        createAssay(assayInfo);
        props.onClose();
    };

    if (!experimentInfo) {
        return null;
    }

    return (
        <CloseableModal
            open={props.open}
            closeFn={props.onClose}
            title={"Add New Assay"}
        >
            <form onSubmit={handleSubmit}>
                <Stack gap={1}>
                    <FormControl fullWidth>
                        <InputLabel id="Assay Type Select Label">
                            Assay Type
                        </InputLabel>
                        <Select
                            id="Assay Type Selection"
                            value={selectedAssayTypeId}
                            label="Assay Type"
                            onChange={(e) => {
                                setSelectedAssayTypeId(Number(e.target.value));
                            }}
                        >
                            {experimentInfo.assayTypes.map(
                                (type: AssayTypeInfo) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.assayType.name}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        sx={{ textTransform: "none" }}
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </CloseableModal>
    );
};
