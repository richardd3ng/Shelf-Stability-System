import { useAlert } from "@/lib/context/shared/alertContext";
import { updatePasswordThroughAPI } from "@/lib/controllers/authController";
import { useMutation } from "@tanstack/react-query";

export const useMutationToUpdatePassword = () => {
    const { showAlert } = useAlert();
    return useMutation({
        mutationFn: updatePasswordThroughAPI,
        onSuccess: () => {
            showAlert("success", "Successfully updated the password!");
        },
    });
};
