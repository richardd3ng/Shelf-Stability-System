import React, {useState} from "react";
import {Typography, Input, TextField, Container, Stack, Button} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { ErrorMessage } from "@/components/shared/errorMessage";
import { LoadingCircle } from "@/components/shared/loading";

export default function LoginPage(){
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = ()=> {
        setIsLoading(true);
		signIn("credentials", {password, redirect : false}).then((d) => {
			if (!d || (d && d.status > 300) ){
                console.log("bad usenrmae")
				setErrorMessage("Wrong username/password");
			} else {
				router.push("/experiment-list");
			}

		}).catch((reason) => {
			
		});
        setIsLoading(false);
	};
    return (
        <Container maxWidth="sm" style={{marginTop : 20, paddingTop : 20}}>
            <Typography align="center" variant="h3">Login</Typography>
			<Stack direction="column" gap={1}>
                <TextField value={password} onChange={(e) => setPassword(e.target.value)} label={"Password"}/>
                <Button color="primary" variant="contained" onClick={handleSubmit}>Sign in</Button>
                <ErrorMessage message={errorMessage}/>
                {isLoading ? <LoadingCircle/> : null}
			</Stack>
		</Container>
    )
}