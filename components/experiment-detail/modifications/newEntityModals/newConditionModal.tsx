// import { ButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
// import { CloseableModal } from "@/components/shared/closeableModal";
// import { useMutationToCreateAssay } from "@/lib/hooks/experimentDetailPage/useCreateEntityHooks";
// import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";
// import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
// import {
//     fetchDistinctAssayTypes,
//     assayTypeNameToId,
// } from "@/lib/controllers/assayTypeController";
// import {
//     FormControl,
//     InputLabel,
//     Stack,
//     Select,
//     MenuItem,
//     TextField,
// } from "@mui/material";
// import { useState } from "react";
// import { AssayCreationArgs } from "@/lib/controllers/types";
// import { useAlert } from "@/lib/context/alert-context";

// interface NewConditionModalProps {
//     open: boolean;
//     onClose: () => void;
// }

// export const NewConditionModal: React.FC<NewConditionModalProps> = (
//     props: NewConditionModalProps
// ) => {
//     const experimentId = useExperimentId();
//     const { data } = useExperimentInfo(experimentId);
//     const [selectedAssayType, setSelectedAssayType] = useState<string>("");
//     const {
//         isPending,
//         isError,
//         error,
//         mutate: createAssayInDB,
//     } = useMutationToCreateAssay();
//     const { showAlert } = useAlert();

//     const onSubmit = () => {
//         if (!selectedAssayType) {
//             showAlert("error", "Please select an assay type.");
//             return;
//         }
//         const assayInfo: AssayCreationArgs = {
//             experimentId: experimentId,
//             conditionId: props.conditionId,
//             type: assayTypeNameToId(selectedAssayType),
//             week: props.week,
//         };
//         createAssayInDB(assayInfo);
//         showAlert("success", "Assay created successfully.");
//         props.onClose();
//     };

//     return (
//         <CloseableModal
//             open={props.open}
//             closeFn={props.onClose}
//             title={"Add New Assay"}
//         >
//             {data ? (
//                 <Stack gap={2}>
//                     <FormControl fullWidth>
//                         <TextField
//                             label="Result"
//                             style={{ marginLeft: 4, marginRight: 4 }}
//                             value={newResult}
//                             onChange={(e) => setNewResult(e.target.value)}
//                         />
//                     </FormControl>
//                 </Stack>
//             ) : null}

//             <ButtonWithLoadingAndError
//                 text="Submit"
//                 isLoading={isPending}
//                 isError={isError}
//                 error={error}
//                 onSubmit={onSubmit}
//             />
//         </CloseableModal>
//     );
// };
