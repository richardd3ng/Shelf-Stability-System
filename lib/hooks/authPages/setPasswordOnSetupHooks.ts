import { useAlert } from "@/lib/context/alert-context";
import { setPasswordOnSetupThroughAPI } from "@/lib/controllers/authController";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useMutationToSetPasswordOnSetup = () => {
    const { showAlert } = useAlert();
    const router = useRouter();
    return useMutation({
        mutationFn: setPasswordOnSetupThroughAPI,
        onSuccess: () => {
            router.push("/auth/login");
            showAlert(
                "success",
                "Successfully set the password! Please login now"
            );
        },
    });
};
