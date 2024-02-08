import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssayResultThroughAPI, deleteAssayResultThroughAPI } from "@/lib/controllers/assayController";
import { useContext } from "react";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";

export const useMutationToUpdateAssayResultFromAgenda = () => {
    const {reload, rows, setRows} = useContext(AgendaContext);
    return useMutation( {
        mutationFn : updateAssayResultThroughAPI,
        onSuccess : (assayData) => {

            let newRows = [...rows];
            newRows.forEach((row) => {
                if (row.id === assayData.assayId){
                    row.result = assayData.newResult;
                }
            })
            setRows(newRows);
        }
        
    })
};

export const useMutationToDeleteAssayResultFromAgenda = () => {
    const {reload, rows, setRows} = useContext(AgendaContext);
    return useMutation( {
        mutationFn : deleteAssayResultThroughAPI,
        onSuccess : (assayId) => {
            let newRows = [...rows];
            newRows.forEach((row) => {
                if (row.id === assayId){
                    row.result = null;
                }
            })
            setRows(newRows);
        }
        
    })
}









