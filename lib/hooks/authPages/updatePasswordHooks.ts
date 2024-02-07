import { useAlert } from "@/context/alert-context";
import { updatePasswordThroughAPI } from "@/lib/controllers/authController";
import { useMutation } from "react-query";


export const useMutationToUpdatePassword = () => {
    const {showAlert} = useAlert();
    return useMutation(updatePasswordThroughAPI, {
        onSuccess: () => {
            showAlert("success", "Successfully updated the password!")
        },
    });
};