import React, { useState } from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import { AuthForm } from "@/components/shared/authForm";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { useMutationToUpdatePassword } from "@/lib/hooks/authPages/updatePasswordHooks";
import { checkIfAdminExists } from "@/lib/api/auth/authHelpers";
import Layout from "@/components/shared/layout";

export default function UpdatePasswordPage() {
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");
    const { mutate: updatePassword } = useMutationToUpdatePassword();
    return (
        <Layout>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            >
                <Stack>
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
                            {
                                value: oldPassword,
                                setValue: setOldPassword,
                                label: "Please enter your old password",
                                shouldBlurText: true,
                            },
                        ]}
                        title="Update Your Password"
                    />
                    {password1 !== password2 &&
                    password1.length > 0 &&
                    password2.length > 0 ? (
                        <ErrorMessage message="Passwords do not match" />
                    ) : null}
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={
                            password1 !== password2 ||
                            password1.length < 1 ||
                            password2.length < 1
                        }
                        sx={{
                            textTransform: "none",
                            width: "91%",
                            alignSelf: "center",
                        }}
                        onClick={() => {
                            updatePassword({
                                newPassword: password1,
                                oldPassword: oldPassword,
                            });
                        }}
                    >
                        <Typography>Submit</Typography>
                    </Button>
                </Stack>
            </Container>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const passwordHasBeenSet = await checkIfAdminExists();
        if (!passwordHasBeenSet) {
            return {
                redirect: {
                    destination: "/auth/setPasswordOnSetup",
                    permanent: false,
                },
            };
        } else {
            return { props: {} };
        }
    } catch {
        return {
            redirect: {
                destination: "/auth/setPasswordOnSetup",
                permanent: false,
            },
        };
    }
}
