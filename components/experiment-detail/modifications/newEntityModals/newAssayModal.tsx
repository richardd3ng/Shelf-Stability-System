import CloseableModal from "@/components/shared/closeableModal";
import { useMutationToCreateAssay } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    getDistinctAssayTypes,
    assayTypeNameToId,
} from "@/lib/controllers/assayTypeController";
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
    const { data } = useExperimentInfo(experimentId);
    const [selectedAssayType, setSelectedAssayType] = useState<string>("");
    const { mutate: createAssay } = useMutationToCreateAssay();
    const { showAlert } = useAlert();

    const onSubmit = async () => {
        if (!selectedAssayType) {
            showAlert("error", "Please select an assay type.");
            return;
        }
        const assayInfo: AssayCreationArgs = {
            experimentId: experimentId,
            conditionId: props.conditionId,
            type: assayTypeNameToId(selectedAssayType),
            week: props.week,
        };
        await createAssay(assayInfo);
        props.onClose();
    };

    if (!data) {
        return <></>;
    }

    return (
        <CloseableModal
            open={props.open}
            closeFn={props.onClose}
            title={"Add New Assay"}
        >
            {data ? (
                <Stack gap={1}>
                    <FormControl fullWidth>
                        <InputLabel id="Assay Type Select Label">
                            Assay Type
                        </InputLabel>
                        <Select
                            id="Assay Type Selection"
                            value={selectedAssayType}
                            label="Assay Type"
                            onChange={(e) => {
                                setSelectedAssayType(e.target.value);
                            }}
                        >
                            {getDistinctAssayTypes().map((type: string) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                        sx={{ textTransform: "none" }}
                    >
                        Submit
                    </Button>
                </Stack>
            ) : null}
        </CloseableModal>
    );
};
