import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { useMutationToCreateAssay } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import {
    FormControl,
    InputLabel,
    Stack,
    Select,
    MenuItem,
} from "@mui/material";
import { useState } from "react";

import dayjs from "dayjs";

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
    const [assayTypeId, setAssayTypeId] = useState<number>(-1);
    const {
        isPending,
        isError,
        error,
        mutate: createAssayInDB,
    } = useMutationToCreateAssay();

    const onSubmit = () => {
        createAssayInDB({
            experimentId: experimentId,
            conditionId: props.conditionId,
            typeId: assayTypeId,
            target_date: dayjs(data?.experiment.start_date)
                .add(props.week, "week")
                .toDate(),
            result: null,
        });
    };
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
                            labelId="Assay Type Select Label"
                            id="Assay Type Selection"
                            value={assayTypeId}
                            label="Assay Type"
                            onChange={(e) => {
                                if (typeof e.target.value === "number") {
                                    setAssayTypeId(e.target.value);
                                }
                            }}
                        >
                            {data.assayTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
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
