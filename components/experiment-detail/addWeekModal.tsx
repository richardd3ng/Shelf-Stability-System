import { FormControl, Stack, TextField } from "@mui/material";
import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { CloseableModal } from "@/components/shared/closeableModal";
import { getAllWeeksCoveredByAssays } from "./experimentTable/experimentTable";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useState } from "react";
import { WeekRow } from "./experimentTable/experimentTable";
import { getNumericalValidationError } from "@/lib/validationUtils";
import { useAlert } from "@/lib/context/alert-context";

interface AddWeekModalProps {
    open: boolean;
    weekRows: WeekRow[];
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

    const duplicateWeekValidation = (week: string): string => {
        const weekNumber = Number(week);
        const weekExistsInTable: boolean = props.weekRows.some(
            (row) => row.week === weekNumber
        );
        const weekExistsInAssays = getAllWeeksCoveredByAssays(
            data?.assays || []
        ).includes(weekNumber);

        return weekExistsInTable || weekExistsInAssays
            ? `Week ${week} already exists.`
            : "";
    };

    const onSubmit = () => {
        if (!data) {
            return;
        }
        const error: string =
            getNumericalValidationError(week, "whole number") ||
            duplicateWeekValidation(week);
        if (error) {
            showAlert("error", error);
            return;
        }
        props.onSubmit(Number(week));
        props.onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            onSubmit();
        }
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
                        <TextField
                            value={week}
                            label="Week #"
                            type="whole number"
                            onChange={(e) => setWeek(e.target.value)}
                            onSubmit={onSubmit}
                            onKeyDown={handleKeyDown}
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
