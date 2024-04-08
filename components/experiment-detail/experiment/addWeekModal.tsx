import { Button, FormControl, Stack, TextField } from "@mui/material";
import CloseableModal from "@/components/shared/closeableModal";
import { parseExperimentWeeks } from "@/lib/api/apiHelpers";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useState } from "react";
import { getNumericalValidationError } from "@/lib/validationUtils";
import { useAlert } from "@/lib/context/shared/alertContext";

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

    const duplicateWeekValidation = (week: string): string => {
        const weekNumber = Number(week);
        const weekExistsInAssays = (
            (data?.experiment && parseExperimentWeeks(data.experiment.weeks)) ||
            []
        ).includes(weekNumber);
        return weekExistsInAssays ? `Week ${week} already exists.` : "";
    };

    const onSubmit = () => {
        if (!data) {
            setWeek("");
            return;
        }
        const error: string =
            getNumericalValidationError(week, "whole number") ||
            duplicateWeekValidation(week);
        if (error) {
            showAlert("error", error);
            setWeek("");
            return;
        }
        setWeek("");
        props.onSubmit(Number(week));
        props.onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            onSubmit();
        }
    };

    if (!data) {
        return <></>;
    }

    return (
        <CloseableModal
            open={props.open}
            closeFn={props.onClose}
            title={"Add New Week"}
        >
            <Stack gap={1}>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    sx={{ textTransform: "none" }}
                >
                    Submit
                </Button>
            </Stack>
        </CloseableModal>
    );
};
