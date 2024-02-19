import { useMutation } from "@tanstack/react-query";
import {
    createAssayResult,
    updateAssayResult,
    deleteAssayResult,
} from "@/lib/controllers/assayResultController";
import { useContext } from "react";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";
import { AssayInfo } from "@/lib/controllers/types";
import { AssayResult } from "@prisma/client";

export const useMutationToCreateAssayResultFromAgenda = () => {
    const { rows, setRows } = useContext(AgendaContext);
    return useMutation({
        mutationFn: createAssayResult,
        onSuccess: (createAssayResult: AssayResult) => {
            let newRows: AssayInfo[] = [...rows];
            for (const row of newRows) {
                if (createAssayResult.assayId === row.id) {
                    row.result = createAssayResult.result;
                    row.comment = createAssayResult.comment;
                    break;
                }
            }
            setRows(newRows);
        },
    });
};

export const useMutationToUpdateAssayResultFromAgenda = () => {
    const { rows, setRows } = useContext(AgendaContext);
    return useMutation({
        mutationFn: updateAssayResult,
        onSuccess: (updatedAssayResult: AssayResult) => {
            let newRows: AssayInfo[] = [...rows];
            for (const row of newRows) {
                if (updatedAssayResult.assayId === row.id) {
                    row.result = updatedAssayResult.result;
                    row.comment = updatedAssayResult.comment;
                    break;
                }
            }
            setRows(newRows);
        },
    });
};

export const useMutationToDeleteAssayResultFromAgenda = () => {
    const { rows, setRows } = useContext(AgendaContext);
    return useMutation({
        mutationFn: deleteAssayResult,
        onSuccess: (deletedAssayResult: AssayResult) => {
            let newRows: AssayInfo[] = [...rows];
            for (const row of newRows) {
                if (deletedAssayResult.assayId === row.id) {
                    row.result = null;
                    row.comment = null;
                    break;
                }
            }
            setRows(newRows);
        },
    });
};
