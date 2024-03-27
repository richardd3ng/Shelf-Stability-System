import CloseableModal from "@/components/shared/closeableModal";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { Button, FormControl, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { ConditionCreationArgs } from "@/lib/controllers/types";
import { useMutationToCreateCondition } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";

interface NewConditionModalProps {
    open: boolean;
    onClose: () => void;
}

export const NewConditionModal: React.FC<NewConditionModalProps> = (
    props: NewConditionModalProps
) => {
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
    const [condition, setCondition] = useState<string>("");
    const { mutate: createCondition } = useMutationToCreateCondition();

    const onSubmit = () => {
        if (!condition) {
            return;
        }
        const conditionInfo: ConditionCreationArgs = {
            experimentId: experimentId,
            name: condition,
            isControl: false,
        };
        createCondition(conditionInfo);
        setCondition("");
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
            title={"Add New Condition"}
        >
            <Stack gap={1}>
                <FormControl fullWidth>
                    <TextField
                        label="Condition"
                        style={{ marginLeft: 4, marginRight: 4 }}
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
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
