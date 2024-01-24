import React, {useState} from "react";
import {Typography, Input, TextField, Container, Stack, Button} from "@mui/material";
import { signIn } from "next-auth/react";

export default function LoginPage(){
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    return (
        <Container maxWidth="sm" style={{marginTop : 20, paddingTop : 20}}>
            <Typography align="center" variant="h3">Login</Typography>
			<Stack direction="column" gap={1}>
                <TextField value={username} onChange={(e) => setUsername(e.target.value)} label={"Username"}/>
                <TextField value={password} onChange={(e) => setPassword(e.target.value)} label={"Password"}/>
                <Button color="primary" variant="contained" onClick={() => signIn("credentials", {username, password, callbackUrl : "/"})}>Sign in</Button>
			</Stack>
		</Container>
    )
}