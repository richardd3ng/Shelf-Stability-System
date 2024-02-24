import { setPasswordOnSetupThroughAPI } from "@/lib/controllers/authController";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";

export const useMutationToSetPasswordOnSetup = () => {
    const router = useRouter();
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    return useMutation({
        mutationFn: setPasswordOnSetupThroughAPI,
        onSuccess: () => {
            router.push("/auth/login");
            showAlert(
                "success",
                "Successfully set password! Please login now."
            );
        },
        onMutate: () => {
            showLoading("Setting password...");
        },
        onSettled: () => {
            hideLoading();
        },
    });
};
