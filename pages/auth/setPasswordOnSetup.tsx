import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { AuthForm } from "@/components/shared/authForm";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { useMutationToSetPasswordOnSetup } from "@/lib/hooks/authPages/setPasswordOnSetupHooks";
import { checkIfAdminExists } from "@/lib/api/auth/authHelpers";

export default function SetPasswordOnSetupPage() {
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const { mutate: setPassword } = useMutationToSetPasswordOnSetup();
    return (
        <Stack>
            <Box alignSelf="center">
                <AuthForm
                    fields={[
                        {
                            value: password1,
                            setValue: setPassword1,
                            label: "Password",
                            shouldBlurText: true,
                        },
                        {
                            value: password2,
                            setValue: setPassword2,
                            label: "Confirm Password",
                            shouldBlurText: true,
                        },
                    ]}
                    title="Set Admin Password"
                />
                {password1 !== password2 &&
                password1.length > 0 &&
                password2.length > 0 ? (
                    <ErrorMessage message="Passwords do not match" />
                ) : null}
            </Box>
            <Box alignSelf="center">
                <Button
                    variant="contained"
                    color="primary"
                    disabled={
                        password1 !== password2 ||
                        password1.length < 1 ||
                        password2.length < 1
                    }
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                        setPassword({ newPassword: password1 });
                    }}
                >
                    <Typography>Submit</Typography>
                </Button>
            </Box>
        </Stack>
    );
}

export async function getServerSideProps() {
    try {
        const passwordHasBeenSet = await checkIfAdminExists();
        if (passwordHasBeenSet) {
            return {
                redirect: {
                    destination: "/auth/updatePassword",
                    permanent: false,
                },
            };
        } else {
            return { props: {} };
        }
    } catch {
        return {
            redirect: {
                destination: "/auth/updatePassword",
                permanent: false,
            },
        };
    }
}
