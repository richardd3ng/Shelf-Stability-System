import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssayResultThroughAPI, deleteAssayResultThroughAPI } from "@/lib/controllers/assayController";
import { useContext } from "react";
import { AgendaContext } from "@/lib/context/agendaPage/agendaContext";

export const useMutationToUpdateAssayResultFromAgenda = () => {
    const {reload} = useContext(AgendaContext);
    return useMutation( {
        mutationFn : updateAssayResultThroughAPI,
        onSuccess : () => {
            reload();
        }
        
    })
};

export const useMutationToDeleteAssayResultFromAgenda = () => {
    const {reload} = useContext(AgendaContext);
    return useMutation( {
        mutationFn : deleteAssayResultThroughAPI,
        onSuccess : () => {
            reload();
        }
        
    })
}









