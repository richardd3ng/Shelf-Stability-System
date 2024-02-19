import { ApiError } from "next/dist/server/api-utils";

interface UpdatePasswordArgs {
    newPassword: string;
    oldPassword: string;
}

export const updatePasswordThroughAPI = async (
    newPasswordInfo: UpdatePasswordArgs
): Promise<UpdatePasswordArgs> => {
    const response = await fetch("/api/auth/updatePassword", {
        method: "POST",
        body: JSON.stringify({
            newPassword: newPasswordInfo.newPassword,
            oldPassword: newPasswordInfo.oldPassword,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return newPasswordInfo;
    }
    throw new ApiError(response.status, resJson.message);
};

interface SetPasswordOnSetupArgs {
    newPassword: string;
}

export const setPasswordOnSetupThroughAPI = async (
    newPasswordInfo: SetPasswordOnSetupArgs
): Promise<SetPasswordOnSetupArgs> => {
    const response = await fetch("/api/auth/setPasswordOnSetup", {
        method: "POST",
        body: JSON.stringify({ newPassword: newPasswordInfo.newPassword }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const resJson = await response.json();
    if (response.ok) {
        return newPasswordInfo;
    }
    throw new ApiError(response.status, resJson.message);
};
