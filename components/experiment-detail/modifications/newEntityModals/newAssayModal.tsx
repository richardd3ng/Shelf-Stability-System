import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { useMutationToCreateAssay } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    fetchDistinctAssayTypes,
    assayTypeNameToId,
} from "@/lib/controllers/assayTypeController";
import {
    FormControl,
    InputLabel,
    Stack,
    Select,
    MenuItem,
} from "@mui/material";
import { useState } from "react";

import dayjs from "dayjs";
import { AssayCreationArgs } from "@/lib/controllers/types";

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
    const {
        isPending,
        isError,
        error,
        mutate: createAssayInDB,
    } = useMutationToCreateAssay();

    const onSubmit = () => {
        const assayInfo: AssayCreationArgs = {
            type: assayTypeNameToId(selectedAssayType),
            week: props.week,
            experimentId: experimentId,
            conditionId: props.conditionId,
        };
        console.log("assay info:", assayInfo);
        createAssayInDB(assayInfo);
    };

    return (
        <CloseableModal
            open={props.open}
            closeFn={props.onClose}
            title={"Add New Assay"}
        >
            {data ? (
                <Stack gap={2}>
                    <FormControl fullWidth>
                        <InputLabel id="Assay Type Select Label">
                            Assay Type
                        </InputLabel>
                        <Select
                            labelId="Assay Type Select Label"
                            id="Assay Type Selection"
                            value={selectedAssayType}
                            label="Assay Type"
                            onChange={(e) => {
                                setSelectedAssayType(e.target.value);
                            }}
                        >
                            {fetchDistinctAssayTypes().map((type: string) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            ) : null}

            <ButtonWithLoadingAndError
                text="Submit"
                isLoading={isPending}
                isError={isError}
                error={error}
                onSubmit={onSubmit}
            />
        </CloseableModal>
    );
};
