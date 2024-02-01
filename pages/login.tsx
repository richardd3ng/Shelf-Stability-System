import React, {useState} from "react";
import {Typography, Input, TextField, Container, Stack, Button} from "@mui/material";
import { signIn } from "next-auth/react";

export default function LoginPage(){
    const [password, setPassword] = useState<string>("");


    return (
        <Container maxWidth="sm" style={{marginTop : 20, paddingTop : 20}}>
            <Typography align="center" variant="h3">Login</Typography>
			<Stack direction="column" gap={1}>
                <TextField value={password} onChange={(e) => setPassword(e.target.value)} label={"Password"}/>
                <Button color="primary" variant="contained" onClick={() => {
                    console.log(password);
                    signIn("credentials", {password, redirect : false});
                }}>Sign in</Button>
			</Stack>
		</Container>
    )
}