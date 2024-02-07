interface UpdatePasswordArgs {
    newPassword : string;
    oldPassword : string;
}
export const updatePasswordThroughAPI = async (newPasswordInfo : UpdatePasswordArgs) : Promise<UpdatePasswordArgs> => {
    const apiResponse = await fetch("/api/auth/updatePassword", {
        method: "POST",
        body : JSON.stringify( {newPassword : newPasswordInfo.newPassword, oldPassword : newPasswordInfo.oldPassword}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return newPasswordInfo;
}

interface SetPasswordOnSetupArgs {
    newPassword : string;
}
export const setPasswordOnSetupThroughAPI = async (newPasswordInfo : SetPasswordOnSetupArgs) : Promise<SetPasswordOnSetupArgs> => {
    const apiResponse = await fetch("/api/auth/setPasswordOnSetup", {
        method: "POST",
        body : JSON.stringify( {newPassword : newPasswordInfo.newPassword}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (apiResponse.status > 300) {
        throw new Error("An error occurred");
    }
    return newPasswordInfo;
}