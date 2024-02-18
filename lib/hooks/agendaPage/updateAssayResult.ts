// import {
//     QueryClient,
//     useMutation,
//     useQueryClient,
// } from "@tanstack/react-query";
// import {
//     updateAssayResult,
//     deleteAssayResult,
// } from "@/lib/controllers/assayResultController";
// import { useContext } from "react";
// import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";

// export const useMutationToUpdateAssayResultFromAgenda = () => {
//     const { assayIdBeingEdited, reload, rows, setRows } =
//         useContext(AgendaContext);
//     return useMutation({
//         mutationFn: updateAssayResult,
//         onSuccess: (assayResultData: Assay) => {
//             let newRows = [...rows];
//             newRows.forEach((row) => {
//                 if (row.id === assayData.assayId) {
//                     row.result = assayData.result;
//                 }
//             });
//             setRows(newRows);
//         },
//     });
// };

// export const useMutationToDeleteAssayResultFromAgenda = () => {
//     const { reload, rows, setRows } = useContext(AgendaContext);
//     return useMutation({
//         mutationFn: deleteAssayResult,
//         onSuccess: (assayId) => {
//             let newRows = [...rows];
//             newRows.forEach((row) => {
//                 if (row.id === assayId) {
//                     row.result = null;
//                 }
//             });
//             setRows(newRows);
//         },
//     });
// };
