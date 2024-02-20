import React, { useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { AuthForm } from "@/components/shared/authForm";
import { YourButtonWithLoadingAndError } from "@/components/shared/buttonWithLoadingAndError";
import { checkIfAdminExists } from "@/lib/api/auth/authHelpers";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = () => {
        setIsLoading(true);
        signIn("credentials", { username, password, redirect: false }).then((d) => {
            if (!d || (d && d.status > 300)) {
                console.log("bad usenrmae")
                setErrorMessage("Wrong username/password");
            } else {
                console.log("trying to push to experiment list page")
                router.push("/experiment-list");
            }

        }).catch((reason) => {

        }).finally(() => {
            setIsLoading(false);
        });

    };
    return (
        <Container maxWidth="sm" style={{ marginTop: 20, paddingTop: 20 }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <AuthForm
                    fields={[
                        {
                            value : username, 
                            setValue : setUsername,
                            label: "Username",
                            passwordType : false
                        },
                        {
                            value: password,
                            setValue: setPassword,
                            label: "Password",
                            passwordType : true
                        }
                    ]}
                    title="Login"
                />
                <YourButtonWithLoadingAndError isError={errorMessage.length > 0} error={new Error(errorMessage)} isLoading={isLoading}>
                    <Button variant="contained" color="primary" type="submit">
                        <Typography>
                            Submit
                        </Typography>
                    </Button>
                </YourButtonWithLoadingAndError>
            </form>
        </Container>
    )
}


export async function getServerSideProps() {
    try {
        const passwordHasBeenSet = await checkIfAdminExists();
        if (!passwordHasBeenSet) {
            return {
                redirect: {
                    destination: '/auth/setPasswordOnSetup',
                    permanent: false,
                },
            }
        } else {
            return { props: {} };
        }
    } catch {
        return {
            redirect: {
                destination: '/auth/setPasswordOnSetup',
                permanent: false,
            },
        }
    }

}