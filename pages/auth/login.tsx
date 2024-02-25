import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { AuthForm } from "@/components/shared/authForm";
import { checkIfAdminExists } from "@/lib/api/auth/authHelpers";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { useAlert } from "@/lib/context/shared/alertContext";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { showLoading, hideLoading } = useLoading();
    const router = useRouter();
    const { showAlert } = useAlert();

    const handleSubmit = () => {
        showLoading("Logging in...");
        signIn("credentials", { username, password, redirect: false })
            .then((d) => {
                if (!d || (d && d.status > 300)) {
                    showAlert("error", "Wrong username/password");
                } else {
                    console.log("trying to push to experiment list page");
                    router.push("/experiment-list");
                }
            })
            .catch((_reason) => {})
            .finally(() => {
                hideLoading();
            });
    };
    return (
        <Stack>
            <Box alignSelf="center">
                <AuthForm
                    fields={[
                        {
                            value: username,
                            setValue: setUsername,
                            label: "Username",
                            shouldBlurText: false,
                        },
                        {
                            value: password,
                            setValue: setPassword,
                            label: "Password",
                            shouldBlurText: true,
                        },
                    ]}
                    title="Login"
                />
            </Box>
            <Box alignSelf="center" sx={{ marginTop: -1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={handleSubmit}
                    sx={{ textTransform: "none" }}
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
