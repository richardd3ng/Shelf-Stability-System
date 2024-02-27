import { updatePasswordThroughAPI } from "@/lib/controllers/authController";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";

export const useMutationToUpdatePassword = () => {
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    return useMutation({
        mutationFn: updatePasswordThroughAPI,
        onSuccess: () => {
            showAlert("success", "Successfully updated the password!");
        },
        onError: (error) => {
            showAlert("error", error.message);
        },
        onMutate: () => {
            showLoading("Updating password...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};
