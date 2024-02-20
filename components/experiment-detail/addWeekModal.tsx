import { FormControl, Stack } from "@mui/material";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { getAllWeeksCoveredByAssays } from "./experimentTable/experimentTable";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useAlert } from "@/lib/context/alert-context";
import { useState } from "react";
import NumericalTextField, {
    getNumericalValidationError,
} from "@/components/shared/numericalTextField";

interface AddWeekModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (week: number) => void;
}

export const AddWeekModal: React.FC<AddWeekModalProps> = (
    props: AddWeekModalProps
) => {
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const [week, setWeek] = useState<string>("");
    const { showAlert } = useAlert();

    const onSubmit = () => {
        if (!data || getNumericalValidationError(week, "whole number")) {
            return;
        }
        if (getAllWeeksCoveredByAssays(data.assays).includes(Number(week))) {
            showAlert("error", `Week ${week} already exists.`);
            return;
        }
        props.onSubmit(Number(week));
        props.onClose();
    };

    return (
        <CloseableModal
            open={props.open}
            closeFn={props.onClose}
            title={"Add New Week"}
        >
            {data ? (
                <Stack gap={2}>
                    <FormControl fullWidth>
                        <NumericalTextField
                            label="Week #"
                            type="whole number"
                            errorText="Please input a valid week number."
                            onChange={setWeek}
                            onSubmit={onSubmit}
                        />
                    </FormControl>
                </Stack>
            ) : null}

            <ButtonWithLoadingAndError
                text="Submit"
                isLoading={false}
                isError={false}
                error={""}
                onSubmit={onSubmit}
            />
        </CloseableModal>
    );
};
