import { useAlert } from "@/context/alert-context";
import { setPasswordOnSetupThroughAPI, updatePasswordThroughAPI } from "@/lib/controllers/authController";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

export const useMutationToSetPasswordOnSetup = () => {
    const {showAlert} = useAlert();
    const router = useRouter();
    return useMutation(setPasswordOnSetupThroughAPI, {
        onSuccess: () => {
            router.push("/auth/login");
            showAlert("success", "Successfully set the password! Please login now");
        },
    });
};