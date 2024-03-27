import React, { useState } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { AuthForm } from "@/components/shared/authForm";
import { checkIfAdminExists } from "@/lib/api/auth/authHelpers";
import { useLoading } from "@/lib/context/shared/loadingContext";
import { useAlert } from "@/lib/context/shared/alertContext";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { showLoading, hideLoading } = useLoading();
    const router = useRouter();
    const { showAlert } = useAlert();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        showLoading("Logging in...");
        signIn("credentials", { username, password, redirect: false })
            .then((d) => {
                if (!d || (d && d.status > 300)) {
                    showAlert("error", "Wrong username/password");
                } else {
                    router.push("/experiment-list");
                }
            })
            .catch((_reason) => {})
            .finally(() => {
                hideLoading();
            });
    };

    const handleOAuth = async () => {
        showLoading("Logging in...");
        await signIn("duke");
    };

    return (
        <Stack>
            <Box alignSelf="center">
                <form onSubmit={handleSubmit}>
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
                    <Stack alignSelf="center" spacing={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={handleSubmit}
                            sx={{ textTransform: "none" }}
                        >
                            <Typography>Submit</Typography>
                        </Button>
                        <Divider />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOAuth}
                            sx={{ textTransform: "none" }}
                        >
                            Sign in with Duke
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Stack>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
            const session = await getServerSession(
                context.req,
                context.res,
                authOptions
            );

            // Signed in, so redirect to the experiment list page
            if (session) {
                return { redirect: { destination: "/experiment-list" } };
            }

            return { props: {} };
        }
    } catch (error) {
        console.log(error);
        return {
            redirect: {
                destination: "/auth/setPasswordOnSetup",
                permanent: false,
            },
        };
    }
}
